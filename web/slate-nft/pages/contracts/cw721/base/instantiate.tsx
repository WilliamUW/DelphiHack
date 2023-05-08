import { Alert } from 'components/Alert'
import { Button } from 'components/Button'
import { Conditional } from 'components/Conditional'
import { ContractPageHeader } from 'components/ContractPageHeader'
import { FormGroup } from 'components/FormGroup'
import { FileInput, TextInput } from 'components/forms/FormInput'
import { useFileInputState, useInputState } from 'components/forms/FormInput.hooks'
import { JsonPreview } from 'components/JsonPreview'
import { LinkTabs } from 'components/LinkTabs'
import { cw721BaseLinkTabs } from 'components/LinkTabs.data'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import type { InstantiateResponse } from 'contracts/cw721/base'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import type { FormEvent } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { CW721_BASE_CODE_ID } from 'utils/constants'
import { withMetadata } from 'utils/layout'

const CW721BaseInstantiatePage: NextPage = () => {
  const wallet = useWallet()
  const { cw721Base: contract } = useContracts()

  const nameState = useInputState({
    id: 'name',
    name: 'name',
    title: 'Artwork Name',
    placeholder: 'Empty Artwork',
  })

  const fileState = useFileInputState({
    id: 'file',
    name: 'file',
    title: 'File',
    placeholder: 'jklf1h2u0hqf8fqrap4dyndz...',
  })

  const { data, isLoading, mutate } = useMutation(
    async (event: FormEvent): Promise<InstantiateResponse | null> => {
      event.preventDefault()
      if (!contract) {
        throw new Error('Smart contract connection failed')
      }

      const formData = new FormData()
      if (!fileState.file) {
        throw new Error('File upload failed')
      }
      formData.append('file', fileState.file)

      let j
      try {
        const uploadRes = await fetch('https://jserver.marstonconnell.xyz/upload', {
          method: 'POST',
          body: formData,
        })
        j = await uploadRes.json()
      } catch (e) {
        throw new Error('File upload failed')
      }

      const msg = {
        name: nameState.value,
        symbol: nameState.value
          .replace(/[aeiou]/gi, '')
          .replace(' ', '')
          .substring(0, 4)
          .toUpperCase(),
        minter: wallet.address,
      }

      const contractInfo = await contract.instantiate(CW721_BASE_CODE_ID, msg, 'Jackal 1:1 NFT', wallet.address)
      const contractAddress = contractInfo.contractAddress

      const messages = contract.messages()
      if (!messages) {
        throw new Error('cannot dispatch execute, messages is not defined')
      }
      const c = contract.use(contractAddress)
      if (!c) {
        throw new Error('cannot dispatch execute, contract is not defined')
      }

      const uri = {
        image: j.fid,
        title: nameState.value,
      }

      const mintInfo = await c.mint('0', contractAddress, JSON.stringify(uri))
      console.log(mintInfo)
      return contractInfo
    },
    {
      onError: (error) => {
        toast.error(String(error))
      },
    },
  )
  return (
    <form className="py-6 px-12 space-y-4" onSubmit={mutate}>
      <NextSeo title="Create NFT" />
      <ContractPageHeader
        description="Create a 1:1 NFT in the Jackal NFT studio for neutron."
        link={''}
        title="NFT Studio"
      />
      <LinkTabs activeIndex={0} data={cw721BaseLinkTabs} />

      <Conditional test={Boolean(data)}>
        <Alert type="info">
          <b>Success!</b> {"Here is your NFT's contract address."}
        </Alert>
        <JsonPreview content={data?.contractAddress} title="NFT address" />
        <br />
      </Conditional>

      <FormGroup subtitle="Details of your artwork." title="Artwork Details">
        <TextInput isRequired {...nameState} />
        <FileInput isRequired {...fileState} />
      </FormGroup>

      <div className="flex items-center p-4">
        <div className="flex-grow" />
        <Button isLoading={isLoading} isWide type="submit">
          Create NFT
        </Button>
      </div>
    </form>
  )
}

export default withMetadata(CW721BaseInstantiatePage, { center: false })
