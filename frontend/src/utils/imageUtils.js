// Utility to construct proper image URLs for both local and cloudinary images
const getBackendBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 
         (import.meta.env.PROD ? 'https://cosearch-backend.onrender.com' : 'http://localhost:8484');
};

// Convert image URLs to proper paths
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already an absolute URL (cloudinary or other external), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /temp/, it's a local frontend image
  if (imagePath.startsWith('/temp/')) {
    // This will be served by Vite from the public directory
    return imagePath;
  }
  
  // If it's just a filename, check if it's a known local image
  if (!imagePath.includes('/')) {
    const localImageNames = [
      'search.png', 'google.png', 'bing.png', 'duckduckgo.png', 
      'ecosia.png', 'yandex.png', 'startpage.png', 'ai.png', 'amazon.png',
      'bbc.png', 'brave.png', 'chatgpt.png', 'claude.png', 'cnn.png',
      'copilot.png', 'dailymotion.png', 'ebay.png', 'etsy.png', 'facebook.png',
      'finance.png', 'flickr.png', 'gemini.png', 'gettyimages.png', 'googlefinance.png',
      'googlenews.png', 'guardian.png', 'huggingface.png', 'instagram.png', 'linkedin.png',
      'meta_ai.png', 'mistral.png', 'moneycontrol.png', 'news.png', 'news_google_com.png',
      'nse.png', 'nyt.png', 'perplexity.png', 'pexels.png', 'pinterest.png',
      'pixabay.png', 'reddit.png', 'reuters.png', 'shop.png', 'shutterstock.png',
      'social.png', 'stock_adobe.png', 'target.png', 'tiktok.png', 'tradingview.png',
      'tumblr.png', 'unsplash.png', 'video.png', 'vimeo.png', 'walmart.png',
      'x.png', 'yahoo.png', 'youtube.png'
    ];
    
    if (localImageNames.includes(imagePath)) {
      // It's a local image, serve from frontend
      return `/temp/${imagePath}`;
    } else {
      // It's likely a backend image, serve from backend
      const backendUrl = getBackendBaseUrl();
      return `${backendUrl}/temp/${imagePath}`;
    }
  }
  
  // If it's a relative path without /temp/, assume it's from backend temp directory
  if (imagePath.startsWith('/')) {
    const backendUrl = getBackendBaseUrl();
    return `${backendUrl}${imagePath}`;
  }
  
  return imagePath;
};

// Helper to check if an image URL needs to be converted
export const isRelativeImageUrl = (url) => {
  return url && (url.startsWith('/temp/') || url.startsWith('/') || !url.includes('://'));
};

// Helper to determine if an image is local (frontend) or remote (backend/cloudinary)
export const isLocalImage = (imagePath) => {
  if (!imagePath) return false;
  
  // Local images are typically default icons in /temp/ directory
  const localImageNames = [
    'search.png', 'google.png', 'bing.png', 'duckduckgo.png', 
    'ecosia.png', 'yandex.png', 'startpage.png', 'ai.png', 'amazon.png',
    'bbc.png', 'brave.png', 'chatgpt.png', 'claude.png', 'cnn.png',
    'copilot.png', 'dailymotion.png', 'ebay.png', 'etsy.png', 'facebook.png',
    'finance.png', 'flickr.png', 'gemini.png', 'gettyimages.png', 'googlefinance.png',
    'googlenews.png', 'guardian.png', 'huggingface.png', 'instagram.png', 'linkedin.png',
    'meta_ai.png', 'mistral.png', 'moneycontrol.png', 'news.png', 'news_google_com.png',
    'nse.png', 'nyt.png', 'perplexity.png', 'pexels.png', 'pinterest.png',
    'pixabay.png', 'reddit.png', 'reuters.png', 'shop.png', 'shutterstock.png',
    'social.png', 'stock_adobe.png', 'target.png', 'tiktok.png', 'tradingview.png',
    'tumblr.png', 'unsplash.png', 'video.png', 'vimeo.png', 'walmart.png',
    'x.png', 'yahoo.png', 'youtube.png'
  ];
  
  const fileName = imagePath.split('/').pop();
  return localImageNames.includes(fileName);
}; 