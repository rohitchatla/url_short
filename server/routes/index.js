import express from 'express';
import mongoose from 'mongoose';
import config from '../../config';
import path from 'path';
import dns from 'dns';
import url from 'url';
import validator from 'validator';

const router = express.Router();

const URL = url.URL;
const Url = mongoose.model('Url');

router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

/** handle short url and redirect */
router.get('/api/shorturl/:url', (req, res, next) => {
  const { url } = req.params;
  Url.findOne({ short_url: url })
    .then((url) => {
      if (!url) {
        throw new Error('Url is not found on database');
      }
      res.redirect(url.original_url);
    })
    .catch((err) => res.send({ error: err.message }));
});

router.post('/api/shorturl', (req, res, next) => {
  ///api/shorturl/new
  const { url } = req.body;
  try {
    if (!validator.isURL(url)) {
      throw new Error('Invalid URL. Please try another valid');
    }
    const objUrl = new URL(url);
    console.log(objUrl);
    dns.lookup(objUrl.hostname, (err, address, family) => {
      if (err) throw err;
      const original_url = objUrl.href;

      Url.findOne({ original_url })
        .then((url) => {
          if (url) return url;
          return Url.create({ original_url });
        })
        .then((url) => {
          const { original_url, short_url } = url;
          return res.send({
            original_url,
            short_url: `${config.domain}/api/shorturl/${short_url}`,
          });
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    console.log(err);
    return res.send({ error: err.message });
  }
});

/** handle other routes */
router.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

export default router;
