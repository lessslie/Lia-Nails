import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadasService } from './empleadas.service';

describe('EmpleadasService', () => {
  let service: EmpleadasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpleadasService],
    }).compile();

    service = module.get<EmpleadasService>(EmpleadasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
