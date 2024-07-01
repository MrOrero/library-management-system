import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthorDto } from '../dto/CreateAuthor.dto';
import { UpdateAuthorDto } from '../dto/UpdateAuthor.dto';
import { AuthorDomain } from '../domain/author.domain';
import { AuthorMapper } from '../mappers/author.mapper';
import { AuthorService } from '../services/author.service';
import { InjectionTokens } from '../../../libs/constants';

class MockAuthorRepository {
  save = jest.fn();
  findPaginated = jest.fn();
  exists = jest.fn();
  findOne = jest.fn();
  findOneAndUpdate = jest.fn();
  findOneAndDelete = jest.fn();
}

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: MockAuthorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: InjectionTokens.AUTHOR_REPOSITORY,
          useClass: MockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<MockAuthorRepository>(
      InjectionTokens.AUTHOR_REPOSITORY,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuthor', () => {
    it('should create an author successfully', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        birthdate: '2000-01-01',
        bio: 'An author bio',
      };

      const authorDomain = AuthorDomain.create(createAuthorDto).getValue();
      const author = AuthorMapper.toPersistence(authorDomain);

      repository.save.mockResolvedValue(author);

      const result = await service.createAuthor(createAuthorDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('bio', author.bio);
      expect(result).toHaveProperty('name', author.name);
      expect(result).toHaveProperty('id');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if author creation fails', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'JD',
        birthdate: 'invalid-date',
        bio: '',
      };

      jest.spyOn(AuthorDomain, 'create').mockReturnValue({
        isFailure: true,
        errorValue: () => 'Invalid data',
        getValue: jest.fn(),
      } as any);

      try {
        await service.createAuthor(createAuthorDto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Invalid data');
      }
    });
  });

  describe('getAllPaginatedAuthors', () => {
    it('should return paginated authors', async () => {
      const paginatedQuery = { page: 1, limit: 10 };
      const paginatedResult = { items: [], total: 0 };

      repository.findPaginated.mockResolvedValue(paginatedResult);

      const result = await service.getAllPaginatedAuthors(paginatedQuery);

      expect(result).toEqual(paginatedResult);
      expect(repository.findPaginated).toHaveBeenCalledWith(paginatedQuery);
    });
  });

  describe('getAuthorById', () => {
    it('should return an author by ID', async () => {
      const id = '1';
      const author = {
        id,
        name: 'John Doe',
        birthDate: '2000-01-01',
        bio: 'An author bio',
        books: [],
      };

      repository.exists.mockResolvedValue(true);
      repository.findOne.mockResolvedValue(author);

      const result = await service.getAuthorById(id);

      expect(result).toEqual(author);
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOne).toHaveBeenCalledWith({ id }, { books: true });
    });

    it('should throw NotFoundException if author not found', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(false);

      try {
        await service.getAuthorById(id);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Author Not Found');
      }
    });
  });

  describe('updateAuthor', () => {
    it('should update an author successfully', async () => {
      const id = '1';
      const updateAuthorDto: UpdateAuthorDto = {
        name: 'John Updated',
        birthdate: '2000-01-01',
        bio: 'An updated author bio',
      };

      repository.exists.mockResolvedValue(true);
      repository.findOneAndUpdate.mockResolvedValue({ id, ...updateAuthorDto });

      const result = await service.updateAuthor(id, updateAuthorDto);

      expect(result).toEqual({ id, ...updateAuthorDto });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { id },
        updateAuthorDto,
      );
    });

    it('should throw NotFoundException if author not found', async () => {
      const id = '1';
      const updateAuthorDto: UpdateAuthorDto = {
        name: 'John Updated',
        birthdate: '2000-01-01',
        bio: 'An updated author bio',
      };

      repository.exists.mockResolvedValue(false);

        try {
            await service.updateAuthor(id, updateAuthorDto);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Author Not Found');
        }
    });
  });

  describe('deleteAuthor', () => {
    it('should delete an author successfully', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(true);
      repository.findOneAndDelete.mockResolvedValue({ deleted: true });

      const result = await service.deleteAuthor(id);

      expect(result).toEqual({ deleted: true });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if author not found', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(false);

        try {
            await service.deleteAuthor(id);
        } catch (error) {
            expect(error.status).toBe(404);
            expect(error.message).toBe('Author Not Found');
        }
    });
  });
});
