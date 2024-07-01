import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";

export const capitalizeWord = (word: string) => {
  // const lower = word.toLowerCase();
  const res = word.charAt(0).toUpperCase() + word.slice(1);
  return res;
};


export const handleErrorCatch = (err, source?: string) => {
  // console.log(err)
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        message: err.response.message || err.response.error,
        error: err.response.error,
      },
      err.status
    );
  }

  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured with the message: ${err.message}`,
      errorType: 'Internal server error'
    },
    HttpStatus.INTERNAL_SERVER_ERROR
  );
};


const handleDbErrors = (err) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException("Invalid Foreign Key");
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException("DB duplicate error value already exists");
  }
};
