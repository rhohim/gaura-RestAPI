import ImageKit from 'imagekit'
import { configFile } from '../config/environment'
const ik = new ImageKit({
  publicKey: configFile.public_key,
  privateKey: configFile.private_key,
  urlEndpoint: configFile.url_endpoint
})

interface File {
  buffer: Buffer
  originalname: string
}

export async function uploadFile(file: File | null): Promise<string> {
  if (!file) return ''

  const uploadResponse = await ik.upload({
    file: file.buffer,
    fileName: file.originalname
  })

  return uploadResponse.url
}
