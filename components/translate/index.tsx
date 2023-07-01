import { TranslateBody } from '@/utils/types';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const apiKey = process.env.OPENAI_API_KEY
const model = 'gpt-3.5-turbo'
const inputLanguage = 'JavaScript'
const outputLanguage = 'Python'

export default function Home() {
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }

    if (!inputCode) {
      alert('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const data = response.body;

    if (!data) {
      setLoading(false);
      alert('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      code += chunkValue;

      setOutputCode((prevCode) => prevCode + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);


  return (
    <>
      <div className="flex h-full min-h-screen flex-col items-center px-4 pb-2">

        <div className="mt-6 flex w-full space-x-6 justify-between">
          <div className="flex flex-col justify-center space-y-2 flex-1">
            <div className="text-center text-xl font-bold">Input</div>
            <Textarea
              className='min-h-[700px]'
              value={inputCode}
              onChange={(value) => {
                setInputCode(value.target.value);
                setHasTranslated(false);
              }}
            />
          </div>
          <div className="flex flex-col justify-center space-y-2 flex-1">
            <div className="text-center text-xl font-bold">Output</div>
            <Textarea
              className='min-h-[700px]'
              value={outputCode}
            />
          </div>
        </div>

        <div className="mt-2 flex items-center space-x-2">
          <Button
            onClick={() => handleTranslate()}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </Button>
        </div>
      </div>
    </>
  );
}
