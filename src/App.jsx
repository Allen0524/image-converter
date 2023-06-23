import {createSignal} from "solid-js"
import {convertFileSize, getBlobSize} from "./utils"

import styles from "./App.module.css"

function App() {
  const [webpUrl, setWebpUrl] = createSignal(null)
  const [quality, setQuality] = createSignal(0.75)
  const [imageInfo, setImageInfo] = createSignal({
    originImg: {size: ""},
    newImg: {size: ""},
  })

  function handleOnFileChange(event) {
    const inputElm = event.target
    const selectedFile = inputElm.files[0]

    if (!selectedFile) return

    setImageInfo(prev => {
      return {
        ...prev,
        originImg: {
          ...prev.originImg,
          size: convertFileSize(selectedFile.size),
        },
      }
    })

    const reader = new FileReader()
    reader.readAsDataURL(selectedFile)

    reader.onload = function (event) {
      const image = new Image()

      image.onload = function (event) {
        const imageData = event.target

        const canvas = document.getElementById("canvas")
        canvas.width = imageData.width
        canvas.height = imageData.height

        const ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

        // const webpDataUrl = canvas.toDataURL("image/webp", 0.75)

        canvas.toBlob(
          async function (blob) {
            const fileSize = await getBlobSize(blob)

            setImageInfo(prev => {
              return {
                ...prev,
                newImg: {
                  ...prev.newImg,
                  size: convertFileSize(fileSize),
                },
              }
            })
            setWebpUrl(blob)
          },
          "image/webp",
          quality(),
        )

        inputElm.value = null
      }

      image.src = event.target.result
    }
  }

  function handleOnDownload() {
    if (!webpUrl()) return

    const a = document.createElement("a")
    const url = URL.createObjectURL(webpUrl())
    a.href = url
    a.download = "image/webp"

    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div class={styles.App}>
      <header class={styles.header}></header>
      <div class={styles.block}>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleOnFileChange}
        />
        <label>
          quality
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={quality()}
            onInput={event => {
              setQuality(parseFloat(event.target.value, 10))
            }}
          />
          <span>{quality()}</span>
        </label>
      </div>
      <div>
        <div>origional size: {imageInfo().originImg.size}</div>
        <div>converted size: {imageInfo().newImg.size}</div>
      </div>
      <canvas id="canvas"></canvas>
      {webpUrl() ? <button onClick={handleOnDownload}>download</button> : null}
    </div>
  )
}

export default App
