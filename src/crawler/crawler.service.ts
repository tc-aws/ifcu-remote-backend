import { Injectable } from '@nestjs/common';

@Injectable()
export class CrawlerService {
  async fetchData() {
    try {
      const response = await fetch(
        'https://data.weather.gov.hk/weatherAPI/opendata/hsww.php?lang=en',
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async processData(data: any) {
    if (!data || !data.hsww || !data.warningLevel || !data.actionCode) {
      return null;
    } else {
      return {
        warningLevel: data.warningLevel,
        actionCode: data.actionCode,
      };
    }
  }
}
