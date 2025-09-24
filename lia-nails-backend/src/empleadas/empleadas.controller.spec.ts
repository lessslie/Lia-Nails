import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadasController } from './empleadas.controller';

describe('EmpleadasController', () => {
  let controller: EmpleadasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpleadasController],
    }).compile();

    controller = module.get<EmpleadasController>(EmpleadasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
