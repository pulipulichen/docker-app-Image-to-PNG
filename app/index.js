const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')

const path = require('path')
const fs = require('fs')

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let main = async function () {
  let files = GetFiles()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    let filenameNoExt = path.parse(filename).name
    let ext = path.extname(filename)

    if (ext === '.png') {
      console.log(`Skipping ${file} as it is already a PNG`)
      continue
    }

    await ShellExec(`cp "${file}" /tmp/input.${ext}`)
    file = `/tmp/input.${ext}`

    let isJPG = false
    let isAVIF = false

    console.log({ext, file})
    if (ext === '.pdf') {
      await ShellExec(`pdftoppm "${file}" "${filenameNoExt}" -png`)
      file = `${filenameNoExt}-1.png`
      ext = '.png'
    }

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.avif') { 
      isJPG = true
    }

    if (ext === '.avif') { 
      isAVIF = true
    }

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.avif') { 
      ext = '.png'
    }

    // fs.writeFileSync(file + '-channels.txt', channels, 'utf8')
    // if (channels.indexOf('a') > -1) {
    dirname = '/output/'
    await ShellExec(`convert "${file}" "${path.resolve(dirname, filenameNoExt + ext)}"`)
    // convert -gravity center "c.png" -flatten -fuzz 1% -trim +repage -resize 64x64 -extent 64x64 "b.ico"

  }
}

main()