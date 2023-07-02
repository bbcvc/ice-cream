import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Image from 'next/image'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'

const BASE_DOMAIN = 'http://localhost:3000/'
const LOGIN_LIMIT_COUNT = 3

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean
  setShowSignInModal: Dispatch<SetStateAction<boolean>>
}) => {
  const supabaseClient = useSupabaseClient()
  const redirectURL = 'http://localhost:3000/'

  return (
    <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
      <DialogContent className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href={BASE_DOMAIN}>
            <Image src="/images/ice-cream.jpg" alt="Logo" className="h-12 w-7 rounded-full" width={28} height={49} />
          </a>
          <h3 className="font-display text-2xl font-bold">Login ice-cream</h3>
          <p className="text-sm ">Prompt, LLM, Design</p>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <Auth
            supabaseClient={supabaseClient}
            redirectTo={redirectURL}
            localization={{
              variables: {
                sign_up: {
                  social_provider_text: 'Sign up with {{provider}}',
                },
                sign_in: {
                  social_provider_text: 'Sign in with {{provider}}',
                },
              },
            }}
            onlyThirdPartyProviders
            providers={[
              'github',
              "google",
            ]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#F17EB8',
                    brandAccent: '#f88dbf',
                    // brandButtonText: "white",
                  },
                },
              },
            }}
          />
        </div>
        <p className="pb-6 text-center text-slate-400">
          By clicking Log In, you agree to our
          <a href="/" target="_blank" className="group underline pl-2" aria-label="Terms of Service">
            Terms of Service 
          </a>
          <span className='px-2'>and</span>
          <Link href="/" target="_blank" className="group underline" aria-label="Privacy Policy">
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  )
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false)

  const SignInModalCallback = useCallback(() => {
    console.log('SignInModalCallback')
    return <SignInModal showSignInModal={showSignInModal} setShowSignInModal={setShowSignInModal} />
  }, [showSignInModal, setShowSignInModal])

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  )
}
