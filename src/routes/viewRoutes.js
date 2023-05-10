import { Router } from 'express';
import cookieParser from 'cookie-parser';

const router = Router();

router.use(cookieParser('secreto'));

router.get('/realtimeproducts', (req, res) => {
  const opts = {
    pageTitle: 'Realtimeproducts HomePage',
  };

  res.render('realTimeProducts', opts);
});

// Cookies managment
router.get('/setCookie', (req, res) => {
  res
    .cookie('Mi cookie', 'Aqui está el mensaje de mi cookie nueva', {
      maxAge: 10000,
      signed: true,
    })
    .send('Cookie creada exitósamente verifífcala');
});

router.get('/getCookies', (req, res) => {
  res.send(req.signedCookies);
});

router.get('/deleteCookie', (req, res) => {
  res.clearCookie('Mi cookie').send('Cookie borrada!');
});

// Session managment
router.get('/session', (req, res) => {
  if (!req.session.counter) {
    req.session.counter = 1;
    res.send('¡Bienvenido usuario nuevo!');
  } else {
    req.session.counter++;
    res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.json({
        error: 'error de logout',
        mensaje: 'Error al finalizar la sessión',
      });

    res.send('Sessión destruida');
  });
});

router.get('/login', (req, res) => {
  const { username, password } = req.query;
  if (username === 'pepe' && password === 'pepepass') {
    req.session.username = username;
    req.session.admin = true;
    res.send(`Login successfull`);
  } else {
    return res.status(401).send(`Login failed, check username and password`);
  }
});

// Auth middleware
function auth(req, res, next) {
  if (req.session.username === 'pepe' && req.session.admin) {
    return next();
  } else {
    return res
      .status(403)
      .send(`Usuario no autorizado para ingresar al recurso`);
  }
}

// Route private
router.get('/private', auth, (req, res) => {
  console.log(req.session.username);
  res.send('Si ves esto es porque se paso la autorización');
});

export default router;
