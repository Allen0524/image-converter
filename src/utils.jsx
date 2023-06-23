export function convertFileSize(sizeInBytes) {
  const kb = sizeInBytes / 1024
  const mb = kb / 1024

  if (mb >= 1) return mb.toFixed(2) + " MB"
  return kb.toFixed(2) + " KB"
}

export function getBlobSize(blob) {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = function () {
      const arrayBuffer = reader.result
      const fileSize = arrayBuffer.byteLength

      resolve(fileSize)
    }

    reader.readAsArrayBuffer(blob)
  })
}
