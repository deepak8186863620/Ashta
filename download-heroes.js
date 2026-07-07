import fs from 'fs';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { agent }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function run() {
  const images = [
    'https://stat2.bollywoodhungama.in/wp-content/uploads/2024/03/Shraddha-Kapoor-joins-demi-fine-jewellery-brand-ASHTA-as-co-founder.jpg',
    'https://images.news18.com/ibnlive/uploads/2024/03/shraddha-kapoor-ASHTA-2024-03-34e8be77e77b47b4e2f896b0520268ec.jpg',
    'https://medias.fashionnetwork.com/image/upload/c_limit,f_auto,h_1000,q_auto,w_1000/v1/medias/660a92023023223126f5d0fba58f8b883015403.jpg'
  ];

  if (!fs.existsSync('./public')) fs.mkdirSync('./public');

  for (let i = 0; i < images.length; i++) {
    await download(images[i], `./public/hero${i+1}.jpg`);
    console.log(`Downloaded hero${i+1}.jpg`);
  }
}

run();
