import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { sleep } from '../utils/sleep.util';

const RATE_LIMIT = 50;
const LIMIT_INTERVAL = 10 * 1000;
const MAX_PAGE_SIZE = 30;

@Injectable()
export class TeamtailorService {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async *getAllCandidates(pageSize = 10) {
    const createRequest = (page: number) =>
      lastValueFrom(
        this.httpService.get('/candidates', {
          params: {
            include: 'job-applications',
            'page[size]': pageSize,
            'page[number]': page,
          },
        }),
      );
    const yieldCandidateData = function* (
      {
        id,
        attributes: { 'first-name': firstName, 'last-name': lastName, email },
        relationships: { 'job-applications': jobApplications },
      },
      included,
    ) {
      let jobApplicationId = '';
      let jobApplicationCreatedAt = '';
      const findApplication =
        (elem) => elem.id === jobApplications.data[0].id;

      if (jobApplications.data.length > 0) {
        const jobApplication = included.find(findApplication);
        jobApplicationId = jobApplication.id;
        jobApplicationCreatedAt = jobApplication.attributes['created-at'];
      }

      yield [
        id,
        firstName,
        lastName,
        email,
        jobApplicationId,
        jobApplicationCreatedAt,
      ];

      // in case there is more than 1 application
      if (jobApplications.data.length > 1) {
        for (let i = 1; i < jobApplications.data.length; i++) { // skip first one
          const jobApplication = included.find(findApplication);
          yield [
            '',
            '',
            '',
            '',
            jobApplication.id,
            jobApplication.attributes['created-at'],
          ];
        }
      }
    };

    let page = 1;
    const firstPageResponse = await createRequest(page);
    for (let item of firstPageResponse.data.data) {
      yield* yieldCandidateData(item, firstPageResponse.data.included);
    }

    let recordsCount = firstPageResponse.data.meta['record-count'];
    let recordsReceived = firstPageResponse.data.data.length;

    // minimize the risk of waiting
    if (recordsCount / pageSize > RATE_LIMIT) {
      const pageSize_ = Math.ceil(RATE_LIMIT / recordsCount);
      pageSize = pageSize_ > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : pageSize_;
    }

    while (recordsReceived < recordsCount) {
      page++;
      if (page % RATE_LIMIT === 0) {
        await sleep(LIMIT_INTERVAL);
      }
      const response = await createRequest(page);
      for (let item of response.data.data) {
        yield* yieldCandidateData(item, response.data.included);
      }
      recordsCount = response.data.meta['record-count'];
      recordsReceived += response.data.data.length;
    }
  }
}
