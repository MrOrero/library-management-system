import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAuthorDto } from '../src/modules/author/dto/CreateAuthor.dto';
import { UpdateAuthorDto } from '../src/modules/author/dto/UpdateAuthor.dto';
import { AppModule } from '../src/app.module';
import { AddBookDto } from 'src/modules/book/dto/AddBook.dto';
import { UpdateBookDto } from 'src/modules/book/dto/UpdateBook.dto';
import { AddBorrowedRecordDto } from 'src/modules/borrowed-record/dto/AddBorrowedRecord.dto';
import { UpdateBorrowedRecordDto } from 'src/modules/borrowed-record/dto/UpdateBorrowedRecord.dto';

const nonExistentId = '123';

const createAuthorDto: CreateAuthorDto = {
  name: 'John Doe',
  birthdate: '2000-01-01',
  bio: 'An author of many books.',
};

describe('AuthorController (e2e)', () => {
  let app: INestApplication;
  let authorId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    request(app.getHttpServer()).delete(`/authors/${nonExistentId}`).end();
    await app.close();
  });

  const updateAuthorDto: UpdateAuthorDto = {
    name: 'John Updated',
    bio: 'An updated author bio.',
    birthdate: '2000-01-01',
  };


  describe('/authors (POST)', () => {
    it('should create an author', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send(createAuthorDto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('name', createAuthorDto.name);
          expect(response.body).toHaveProperty(
            'birthdate',
            createAuthorDto.birthdate + 'T00:00:00.000Z',
          );
          expect(response.body).toHaveProperty('bio', createAuthorDto.bio);
          authorId = response.body.id;
        });
    });

    it('should return 400 if property is invalid', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({ ...createAuthorDto, name: '' })
        .expect(400);
    });
  });

  describe('/authors (GET)', () => {
    it('should get all authors', () => {
      return request(app.getHttpServer())
        .get('/authors')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should get all authors with pagination', () => {
      return request(app.getHttpServer())
        .get('/authors?size=1&page=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(1);
          expect(res.body.pagination).toBeDefined();
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.size).toBe(1);
        });
    });

    it('should filter authors by field', () => {
      return request(app.getHttpServer())
        .get(`/authors?filterBy=name&filter=${createAuthorDto.name}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data[0]).toHaveProperty('name', createAuthorDto.name);
        });
    });
  });

  describe('/authors/:id (GET)', () => {
    it('should get an author by id', () => {
      return request(app.getHttpServer())
        .get(`/authors/${authorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', authorId);
          expect(res.body).toHaveProperty('name', createAuthorDto.name);
          expect(res.body).toHaveProperty(
            'birthdate',
            createAuthorDto.birthdate + 'T00:00:00.000Z',
          );
          expect(res.body).toHaveProperty('bio', createAuthorDto.bio);
        });
    });

    it('should return 404 if author does not exist', () => {
      return request(app.getHttpServer())
        .get(`/authors/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/authors/:id (PUT)', () => {
    it('should update an author', () => {
      request(app.getHttpServer())
        .put(`/authors/${authorId}`)
        .send(updateAuthorDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', authorId);
          expect(res.body).toHaveProperty('name', updateAuthorDto.name);
          expect(res.body).toHaveProperty('bio', updateAuthorDto.bio);
        });
    });

    it('should return 404 if author does not exist', () => {
      return request(app.getHttpServer())
        .put(`/authors/${nonExistentId}`)
        .send(updateAuthorDto)
        .expect(404);
    });
  });

  describe('/authors/:id (DELETE)', () => {
    it('should delete an author', () => {
      return request(app.getHttpServer())
        .delete(`/authors/${authorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
        });
    });

    it('should return 404 if author does not exist', () => {
      return request(app.getHttpServer())
        .delete(`/authors/${nonExistentId}`)
        .expect(404);
    });
  });
});

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let authorId: string = '';

  const createBookDto: AddBookDto = {
    title: 'Book Title',
    authorId: authorId,
    availableCopies: 10,
    genre: 'Fiction',
    publishedYear: '2000',
  };

  const updateBookDto: UpdateBookDto = {
    title: 'Book Title Updated',
    authorId: authorId,
    availableCopies: 10,
    genre: 'Fiction',
    publishedYear: '2000',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    request(app.getHttpServer()).delete(`/authors/${authorId}`).end();
    await app.close();
  });

  let bookId: string;

  it('should create an author', () => {
    return request(app.getHttpServer())
      .post('/authors')
      .send(createAuthorDto)
      .expect(201)
      .expect((response) => {
        createBookDto.authorId = response.body.id;
        updateBookDto.authorId = response.body.id;
        authorId = response.body.id;
      });
  });

  describe('/books (POST)', () => {
    it('should create a book', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .expect(201)
        .expect((res) => {
          bookId = res.body.id;
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title', createBookDto.title);
          expect(res.body).toHaveProperty('authorId', createBookDto.authorId);
          expect(res.body).toHaveProperty(
            'availableCopies',
            createBookDto.availableCopies,
          );
          expect(res.body).toHaveProperty('genre', createBookDto.genre);
          expect(res.body).toHaveProperty(
            'publishedYear',
            createBookDto.publishedYear,
          );
        });
    });

    it('should return 400 if property is invalid', () => {
      return request(app.getHttpServer())
        .post('/books')
        .send({ ...createBookDto, publishedYear: '8932' })
        .expect(400);
    });
  });

  describe('/books (GET)', () => {
    it('should get all books', () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should get all books with pagination', () => {
      return request(app.getHttpServer())
        .get('/books?size=1&page=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(1);
          expect(res.body.pagination).toBeDefined();
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.size).toBe(1);
        });
    });

    it('should filter books by field', () => {
      return request(app.getHttpServer())
        .get(`/books?filterBy=genre&filter=${createBookDto.genre}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data[0]).toHaveProperty('genre', createBookDto.genre);
        });
    });
  });

  describe('/books/:id (GET)', () => {
    it('should get a book by id', () => {
      return request(app.getHttpServer())
        .get(`/books/${bookId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', bookId);
          expect(res.body).toHaveProperty('title', createBookDto.title);
          expect(res.body).toHaveProperty('authorId', createBookDto.authorId);
          expect(res.body).toHaveProperty(
            'availableCopies',
            createBookDto.availableCopies,
          );
          expect(res.body).toHaveProperty('genre', createBookDto.genre);
          expect(res.body).toHaveProperty(
            'publishedYear',
            createBookDto.publishedYear,
          );
        });
    });

    it('should return 404 if book does not exist', () => {
      return request(app.getHttpServer())
        .get(`/books/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/books/:id (PUT)', () => {
    it('should update a book', () => {
      request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send(updateBookDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', bookId);
          expect(res.body).toHaveProperty('title', updateBookDto.title);
          expect(res.body).toHaveProperty(
            'publishedYear',
            updateBookDto.publishedYear,
          );
          expect(res.body).toHaveProperty('authorId', updateBookDto.authorId);
          expect(res.body).toHaveProperty(
            'availableCopies',
            updateBookDto.availableCopies,
          );
        });
    });

    it('should return 404 if book does not exist', () => {
      return request(app.getHttpServer())
        .put(`/books/${nonExistentId}`)
        .send(updateBookDto)
        .expect(404);
    });
  });

  describe('/books/:id (DELETE)', () => {
    it('should delete a book', () => {
      return request(app.getHttpServer())
        .delete(`/books/${bookId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', true);
        });
    });

    it('should return 404 if book does not exist', () => {
      return request(app.getHttpServer())
        .delete(`/books/${nonExistentId}`)
        .expect(404);
    });
  });
});

describe('BorrowedRecordController (e2e)', () => {
  let app: INestApplication;
  let bookId: string = '';
  let authorId: string = '';
  let borrowedRecordId: string = '';

  const addBorrowedRecordDto: AddBorrowedRecordDto = {
    bookId,
    borrowDate: '2021-01-01',
    borrower: 'John Doe',
    returnDate: '2021-02-01',
  };

  const updateBorrowedRecordDto: UpdateBorrowedRecordDto = {
    borrowDate: '2021-01-01',
    borrower: 'John Doe',
    returnDate: '2025-02-01',
  };

  const createBookDto: AddBookDto = {
    title: 'Book Title',
    authorId: authorId,
    availableCopies: 10,
    genre: 'Fiction',
    publishedYear: '2000',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    request(app.getHttpServer()).delete(`/authors/${authorId}`).end();
    request(app.getHttpServer()).delete(`/books/${bookId}`).end();
    await app.close();
  });


  it('should create an author', () => {
    return request(app.getHttpServer())
      .post('/authors')
      .send(createAuthorDto)
      .expect(201)
      .expect((response) => {
        authorId = response.body.id;
        createBookDto.authorId = response.body.id;
      });
  });

  it('should create a book', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send(createBookDto)
      .expect(201)
      .expect((res) => {
        bookId = res.body.id;
        addBorrowedRecordDto.bookId = res.body.id;
      });
  });

  describe('/borrow-records (POST)', () => {
    it('should create a borrow record', () => {
      return request(app.getHttpServer())
        .post('/borrow-records')
        .send(addBorrowedRecordDto)
        .expect(201)
        .expect((res) => {
          borrowedRecordId = res.body.id;
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('bookId', bookId);
        });
    });

    it('should return 400 if property is invalid', () => {
      return request(app.getHttpServer())
        .post('/borrow-records')
        .send({ ...addBorrowedRecordDto, returnDate : 'chocolate' })
        .expect(400);
    });
  });

  describe('/borrow-records (GET)', () => {
    it('should get all borrow records', () => {
      return request(app.getHttpServer())
        .get('/borrow-records')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should get all borrow records with pagination', () => {
      return request(app.getHttpServer())
        .get('/borrow-records?size=1&page=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(1);
          expect(res.body.pagination).toBeDefined();
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.size).toBe(1);
        });
    });

    describe('/borrow-records/:id (PUT)', () => {
      it('should update a borrow record', () => {
        request(app.getHttpServer())
          .put(`/borrow-records/${borrowedRecordId}`)
          .send(updateBorrowedRecordDto)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', bookId);
            expect(res.body).toHaveProperty('bookId', bookId);
            expect(res.body).toHaveProperty(
              'returnDate',
              updateBorrowedRecordDto.returnDate,
            );
          });
      });

      it('should return 404 if borrow record does not exist', () => {
        return request(app.getHttpServer())
          .put(`/borrow-records/${nonExistentId}`)
          .send(updateBorrowedRecordDto)
          .expect(404);
      });
    });

    describe('/borrow-records/:id (DELETE)', () => {
      it('should delete a borrow record', () => {
        return request(app.getHttpServer())
          .delete(`/borrow-records/${borrowedRecordId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('status', true);
          });
      });

      it('should return 404 if borrow record does not exist', () => {
        return request(app.getHttpServer())
          .delete(`/borrow-records/${borrowedRecordId}`)
          .expect(404);
      });
    });
  });
});
