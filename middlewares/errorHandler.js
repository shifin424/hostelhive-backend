const errorHandler = (err, req, res, next) => {
    console.log(err);
  
    let statusCode;
  
    switch (err.status) {
      case 404:
        statusCode = 404;
        res.status(statusCode).send('Not found');
        break;
      case 400:
        statusCode = 400;
        res.status(statusCode).send('Bad request');
        break;
      case 401:
        statusCode = 401;
        res.status(statusCode).send('Unauthorized');
        break;
      default:
        statusCode = 500;
        res.status(statusCode).send('Something went wrong');
        break;
    }
  };
  
  export default errorHandler;
  