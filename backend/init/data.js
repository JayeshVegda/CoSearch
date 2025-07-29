const _mongoose = require('mongoose');

function getDefaultUserData(userId) {
  return {
    userId,
    engine: [
      {
        categoryName: 'Search',
        description: 'Search engines and web search platforms',
        url: [
          { siteName: 'Google', icon: { public_id: 'google', url: '/temp/google.png' }, siteUrl: 'https://www.google.com/search?q={q}', isChecked: true },
          { siteName: 'Bing', icon: { public_id: 'bing', url: '/temp/bing.png' }, siteUrl: 'https://www.bing.com/search?q={q}', isChecked: true },
          { siteName: 'DuckDuckGo', icon: { public_id: 'duckduckgo', url: '/temp/duckduckgo.png' }, siteUrl: 'https://duckduckgo.com/?q={q}', isChecked: true },
          { siteName: 'Startpage', icon: { public_id: 'startpage', url: '/temp/startpage.png' }, siteUrl: 'https://www.startpage.com/sp/search?query={q}', isChecked: true },
          { siteName: 'Ecosia', icon: { public_id: 'ecosia', url: '/temp/ecosia.png' }, siteUrl: 'https://www.ecosia.org/search?q={q}', isChecked: true },
          { siteName: 'Yandex', icon: { public_id: 'yandex', url: '/temp/yandex.png' }, siteUrl: 'https://yandex.com/search/?text={q}', isChecked: true },
          { siteName: 'Brave Search', icon: { public_id: 'brave', url: '/temp/brave.png' }, siteUrl: 'https://search.brave.com/search?q={q}', isChecked: true },
        ],
      },
      {
        categoryName: 'AI',
        description: 'AI chat and search platforms',
        url: [
          { siteName: 'ChatGPT', icon: { public_id: 'chatgpt', url: '/temp/chatgpt.png' }, siteUrl: 'https://chat.openai.com/', isChecked: true },
          { siteName: 'Perplexity', icon: { public_id: 'perplexity', url: '/temp/perplexity.png' }, siteUrl: 'https://www.perplexity.ai/', isChecked: true },
          { siteName: 'Claude', icon: { public_id: 'claude', url: '/temp/claude.png' }, siteUrl: 'https://claude.ai/', isChecked: true },
          { siteName: 'Copilot', icon: { public_id: 'copilot', url: '/temp/copilot.png' }, siteUrl: 'https://copilot.microsoft.com/', isChecked: true },
          { siteName: 'HuggingChat', icon: { public_id: 'huggingface', url: '/temp/huggingface.png' }, siteUrl: 'https://huggingface.co/chat', isChecked: true },
          { siteName: 'Mistral', icon: { public_id: 'mistral', url: '/temp/mistral.png' }, siteUrl: 'https://chat.mistral.ai/', isChecked: true },
          { siteName: 'Gemini', icon: { public_id: 'gemini', url: '/temp/gemini.png' }, siteUrl: 'https://gemini.google.com/', isChecked: true },
          { siteName: 'Meta AI', icon: { public_id: 'meta_ai', url: '/temp/meta_ai.png' }, siteUrl: 'https://www.meta.ai/', isChecked: true },
        ],
      },
      {
        categoryName: 'Video',
        description: 'Video streaming and sharing platforms',
        url: [
          { siteName: 'YouTube', icon: { public_id: 'youtube', url: '/temp/youtube.png' }, siteUrl: 'https://www.youtube.com/results?search_query={q}', isChecked: true },
          { siteName: 'Vimeo', icon: { public_id: 'vimeo', url: '/temp/vimeo.png' }, siteUrl: 'https://vimeo.com/search?q={q}', isChecked: true },
          { siteName: 'Dailymotion', icon: { public_id: 'dailymotion', url: '/temp/dailymotion.png' }, siteUrl: 'https://www.dailymotion.com/search/{q}', isChecked: true },
        ],
      },
      {
        categoryName: 'Photo',
        description: 'Photo and image resource platforms',
        url: [
          { siteName: 'Pinterest', icon: { public_id: 'pinterest', url: '/temp/pinterest.png' }, siteUrl: 'https://www.pinterest.com/search/pins/?q={q}', isChecked: true },
          { siteName: 'Unsplash', icon: { public_id: 'unsplash', url: '/temp/unsplash.png' }, siteUrl: 'https://unsplash.com/s/photos/{q}', isChecked: true },
          { siteName: 'Pexels', icon: { public_id: 'pexels', url: '/temp/pexels.png' }, siteUrl: 'https://www.pexels.com/search/{q}/', isChecked: true },
          { siteName: 'Pixabay', icon: { public_id: 'pixabay', url: '/temp/pixabay.png' }, siteUrl: 'https://pixabay.com/images/search/{q}', isChecked: true },
          { siteName: 'Getty Images', icon: { public_id: 'gettyimages', url: '/temp/gettyimages.png' }, siteUrl: 'https://www.gettyimages.com/photos/{q}', isChecked: true },
          { siteName: 'Shutterstock', icon: { public_id: 'shutterstock', url: '/temp/shutterstock.png' }, siteUrl: 'https://www.shutterstock.com/search/{q}', isChecked: true },
          { siteName: 'Flickr', icon: { public_id: 'flickr', url: '/temp/flickr.png' }, siteUrl: 'https://www.flickr.com/search/?text={q}', isChecked: true },
          { siteName: 'Adobe Stock', icon: { public_id: 'stock_adobe', url: '/temp/stock_adobe.png' }, siteUrl: 'https://stock.adobe.com/search?k={q}', isChecked: true },
        ],
      },
      {
        categoryName: 'Shopping',
        description: 'Online shopping and retail platforms',
        url: [
          { siteName: 'Amazon', icon: { public_id: 'amazon', url: '/temp/amazon.png' }, siteUrl: 'https://www.amazon.com/s?k={q}', isChecked: true },
          { siteName: 'eBay', icon: { public_id: 'ebay', url: '/temp/ebay.png' }, siteUrl: 'https://www.ebay.com/sch/i.html?_nkw={q}', isChecked: true },
          { siteName: 'Walmart', icon: { public_id: 'walmart', url: '/temp/walmart.png' }, siteUrl: 'https://www.walmart.com/search?q={q}', isChecked: true },
          { siteName: 'AliExpress', icon: { public_id: 'aliexpress', url: '/temp/aliexpress.png' }, siteUrl: 'https://www.aliexpress.com/wholesale?SearchText={q}', isChecked: true },
          { siteName: 'Best Buy', icon: { public_id: 'bestbuy', url: '/temp/bestbuy.png' }, siteUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st={q}', isChecked: true },
          { siteName: 'Target', icon: { public_id: 'target', url: '/temp/target.png' }, siteUrl: 'https://www.target.com/s?searchTerm={q}', isChecked: true },
          { siteName: 'Etsy', icon: { public_id: 'etsy', url: '/temp/etsy.png' }, siteUrl: 'https://www.etsy.com/search?q={q}', isChecked: true },
        ],
      },
      {
        categoryName: 'Social',
        description: 'Social media and networking platforms',
        url: [
          { siteName: 'X', icon: { public_id: 'x', url: '/temp/x.png' }, siteUrl: 'https://x.com/search?q={q}&f=user', isChecked: true },
          { siteName: 'Facebook', icon: { public_id: 'facebook', url: '/temp/facebook.png' }, siteUrl: 'https://www.facebook.com/search/top/?q={q}', isChecked: true },
          { siteName: 'Instagram', icon: { public_id: 'instagram', url: '/temp/instagram.png' }, siteUrl: 'https://www.instagram.com/explore/tags/{q}/', isChecked: true },
          { siteName: 'Reddit', icon: { public_id: 'reddit', url: '/temp/reddit.png' }, siteUrl: 'https://www.reddit.com/search/?q={q}', isChecked: true },
          { siteName: 'LinkedIn', icon: { public_id: 'linkedin', url: '/temp/linkedin.png' }, siteUrl: 'https://www.linkedin.com/search/results/all/?keywords={q}', isChecked: true },
          { siteName: 'TikTok', icon: { public_id: 'tiktok', url: '/temp/tiktok.png' }, siteUrl: 'https://www.tiktok.com/search?q={q}', isChecked: true },
        ],
      },
      {
        categoryName: 'News',
        description: 'News and media information sources',
        url: [
          { siteName: 'Google News', icon: { public_id: 'news_google_com', url: '/temp/news_google_com.png' }, siteUrl: 'https://news.google.com/search?q={q}', isChecked: true },
          { siteName: 'BBC News', icon: { public_id: 'bbc', url: '/temp/bbc.png' }, siteUrl: 'https://www.bbc.co.uk/search?q={q}', isChecked: true },
          { siteName: 'CNN', icon: { public_id: 'cnn', url: '/temp/cnn.png' }, siteUrl: 'https://edition.cnn.com/search?q={q}', isChecked: true },
          { siteName: 'Reuters', icon: { public_id: 'reuters', url: '/temp/reuters.png' }, siteUrl: 'https://www.reuters.com/search/news?blob={q}', isChecked: true },
          { siteName: 'The Guardian', icon: { public_id: 'guardian', url: '/temp/guardian.png' }, siteUrl: 'https://www.theguardian.com/uk/{q}', isChecked: true },
          { siteName: 'New York Times', icon: { public_id: 'nyt', url: '/temp/nyt.png' }, siteUrl: 'https://www.nytimes.com/search?query={q}', isChecked: true },
          { siteName: 'Al Jazeera', icon: { public_id: 'aljazeera', url: '/temp/aljazeera.png' }, siteUrl: 'https://www.aljazeera.com/search/{q}', isChecked: true },
        ],
      },
      {
        categoryName: 'Finance',
        description: 'Finance and stock market platforms',
        url: [
          { siteName: 'Yahoo Finance', icon: { public_id: 'yahoo', url: '/temp/yahoo.png' }, siteUrl: 'https://finance.yahoo.com/quote/{q}', isChecked: true },
          { siteName: 'Google Finance', icon: { public_id: 'googlefinance', url: '/temp/googlefinance.png' }, siteUrl: 'https://www.google.com/finance/quote/{q}', isChecked: true },
          { siteName: 'TradingView', icon: { public_id: 'tradingview', url: '/temp/tradingview.png' }, siteUrl: 'https://www.tradingview.com/chart/?symbol={q}', isChecked: true },
          { siteName: 'Moneycontrol', icon: { public_id: 'moneycontrol', url: '/temp/moneycontrol.png' }, siteUrl: 'https://www.moneycontrol.com/india/stockpricequote/{q}', isChecked: true },
          { siteName: 'NSE India', icon: { public_id: 'nse', url: '/temp/nse.png' }, siteUrl: 'https://www.nseindia.com/get-quotes/equity?symbol={q}', isChecked: true },
        ],
      },
    ],
    lastActivity: new Date(),
  };
}

module.exports = getDefaultUserData;
