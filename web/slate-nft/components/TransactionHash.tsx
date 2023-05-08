import clsx from 'clsx'
import { NETWORK } from 'utils/constants'
import { links } from 'utils/links'

import { AnchorButton } from './AnchorButton'
import { StyledInput } from './forms/StyledInput'

interface TransactionHashProps {
  hash: string
  className?: string
}

export const TransactionHash = ({ hash, className }: TransactionHashProps) => {
  return (
    <div
      className={clsx(
        'bg-white/10 rounded border-2 border-black/20 form-input',
        'focus:ring focus:ring-plumbus-20',
        hash !== '' ? 'text-black/100' : 'text-black/50',
        'flex justify-end    items-center',
        className,
      )}
    >
      <StyledInput
        className={clsx(
          'flex-auto w-fit',
          'bg-white/5 rounded border-0 border-black/20 focus:ring-0 form-input',
          hash !== '' ? 'text-black/100' : 'text-black/50',
          className,
        )}
        value={hash || 'Waiting for execution...'}
      />
      <AnchorButton
        className={clsx('ml-2 text-black', hash === '' ? 'text-black/30 bg-opacity-20 hover:bg-opacity-10' : '')}
        href={`${links.Explorer}/tx${NETWORK === 'mainnet' ? 's' : ''}/${hash}`}
        onClick={(e) => {
          if (hash === '') e.preventDefault()
        }}
      >
        Go to Explorer
      </AnchorButton>
    </div>
  )
}
