/**
*
* Export Facebook Ads Data to Google Sheets
* 
* Requests a Facebook report asynchronously and caches the report ID
*
* Version: 2.2
*
* Google Apps Script maintained by Frederic Harnois
* fred@fredericharnois.com
*
**/

// MODIFY YOUR REPORT HERE //

// ad account ID
const AD_ACCOUNT_ID = '542423740792694'

// ad, adset, campaign, account
const LEVEL = 'ad'

// https://developers.facebook.com/docs/marketing-api/insights/parameters#fields
const FIELDS = 'clicks,ctr,cpm,impressions,spend'

// https://developers.facebook.com/docs/marketing-api/insights/parameters#param
const DATE_RANGE = 'last_28d'

// user access token linked to a Facebook app
const TOKEN = 'EAAtOS0pufesBAPBoWyrFmYV35QEuYfXSI8ZC7ScxexcAqZAUm4Iv04Dw4ZAr1IaiWUt7qXdqSZCyZBRIQ4W3waWD81jUZATGD3yIQodrpX0nKvO9p9ivjy18RPtAIskzL6lLYRuD5bZAqFQbkuhep3PVLNZCBrdBoR0MJXMcqBrP0zZA63mdRAZBORHr3U4jlyAhhX3MEl11OMo7rtz2R2sgGLPwLMVM4B7cwZD'

// number of days from 1 to 90
const TIME_INCREMENT = '1'

// https://developers.facebook.com/docs/marketing-api/insights/parameters#param
const FILTERING = 'INSERT_FILTERS'

// DO NOT MODIFY ANYTHING BELOW //

function requestFacebookReport() {

  // Builds the Facebook Ads Insights API URL
  const facebookUrl = `https://graph.facebook.com/v7.0/act_${AD_ACCOUNT_ID}/insights?level=${LEVEL}&fields=${FIELDS}&date_preset=${DATE_RANGE}&access_token=${TOKEN}&time_increment=${TIME_INCREMENT}&filtering=${FILTERING}&limit=1000`;
  const encodedFacebookUrl = encodeURI(facebookUrl);
  
  const options = {
    'method' : 'post'
  };
  
  // Fetches & parses the URL 
  const fetchRequest = UrlFetchApp.fetch(encodedFacebookUrl, options);
  const results = JSON.parse(fetchRequest.getContentText());
  
  // Caches the report run ID
  const reportId = results.report_run_id;
  const cache = CacheService.getScriptCache();
  const cached = cache.get('campaign-report-id');
  
  if (cached != null) {
    cache.put('campaign-report-id', [], 1);
    Utilities.sleep(1001);
    cache.put('campaign-report-id', reportId, 21600);
  } else {
    cache.put('campaign-report-id', reportId, 21600); 
  };
  
  Logger.log(cache.get('campaign-report-id'));
}
