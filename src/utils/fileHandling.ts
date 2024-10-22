import ImageKit from 'imagekit'
const ik = new ImageKit({
  publicKey: 'public_Osi6s+nNxW1wl62XArIK2HR6zAU=',
  privateKey: 'private_BRlQFtaDusMUSfoBRxmhunXJ9G0=',
  urlEndpoint: 'https://ik.imagekit.io/gauradev'
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
