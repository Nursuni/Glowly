import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

import {
  BATCH_ROLLBACK,
  BATCH_TOP_PRODUCTS,
  BATCH_TOP_SELLERS,
} from './lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');

  constructor(private readonly batchService: BatchService) {}

  @Timeout(1000)
  handleTimeOut() {
    this.logger.debug('BATCH SERVER READY');
  }
  @Cron('00 00 * * * *', { name: BATCH_ROLLBACK })
  public async batchRollback() {
    try {
      this.logger['context'] = BATCH_ROLLBACK;
      this.logger.debug('EXECUTED!');
      await this.batchService.batchRollback();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('20 00 * * * *', { name: BATCH_TOP_PRODUCTS })
  public async batchProducts() {
    try {
      this.logger['context'] = BATCH_TOP_PRODUCTS;
      this.logger.debug('EXECUTED!');
      await this.batchService.batchTopProducts();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron('40 00 * * * *', { name: BATCH_TOP_SELLERS })
  public async batchSellers() {
    try {
      this.logger['context'] = BATCH_TOP_SELLERS;
      this.logger.debug('EXECUTED!');
      await this.batchService.batchTopSellers();
    } catch (err) {
      this.logger.error(err);
    }
  }
  @Cron('*/20 * * * * *', { name: 'CRON_TEST' })
  public cronTest() {
    this.logger['context'] = 'CRON_TEST';
    this.logger.debug('EXECUTED!');
  }
  /*
	@Interval(1000)
	handleInterval() {
		this.logger.debug('INTERVAL TEST');
	}
		*/

  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}
