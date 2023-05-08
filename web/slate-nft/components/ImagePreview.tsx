import { useEffect, useState } from 'react'

export interface ImagePreviewProps {
  response: any
}

export const ImagePreview = ({ response }: ImagePreviewProps) => {
  const [image, setImage] = useState('')
  const [owner, setOwner] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    async function getImage() {
      if (!response) {
        return
      }
      if (!response.info) {
        return
      }
      if (!response.access) {
        return
      }
      const token = JSON.parse(response.info.token_uri)
      const findFileUrl = 'https://api.jackalprotocol.com/jackal-dao/canine-chain/storage/find_file/'
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      let r = await fetch(findFileUrl + token.image)
      const j = await r.json()
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      r = await fetch(JSON.parse(j.provider_ips)[0] + '/download/' + token.image)
      const img = await r.blob()
      const b = URL.createObjectURL(img)
      setImage(b)
      setOwner(response.access.owner)
      setTitle(token.title)
    }

    if (!image) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getImage()
    }
  })
  if (!response) return null
  if (!image) return null

  return (
    <div
      className={'border-black border-solid border-2 p-8 block'}
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      <span className={'mb-4 block text-xl text-center'}>{title}</span>

      <img alt={'artwork from the nft'} style={{ margin: 'auto', width: '100%' }} className={'block'} src={image}></img>

      <span className={'px-4 mt-6 block'} style={{ fontWeight: 'bold' }}>
        Owner:
      </span>
      <span
        className={'px-4 block'}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {owner}
      </span>
    </div>
  )
}
