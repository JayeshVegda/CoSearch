const mongoose = require('mongoose');

// Generate fake data for testing
function generateTestData() {
  const users = [];
  
  // Create 10 test users with different data
  for (let i = 1; i <= 10; i++) {
    const userData = {
      userId: `testuser${i}`,
      engine: [
        {
          categoryName: 'Search',
          description: 'Search engines for testing',
          url: [
            { 
              siteName: 'Google Test', 
              icon: { public_id: 'google_test', url: 'https://res.cloudinary.com/test/image/upload/google_test.png' }, 
              siteUrl: 'https://www.google.com/search?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Bing Test', 
              icon: { public_id: 'bing_test', url: 'https://res.cloudinary.com/test/image/upload/bing_test.png' }, 
              siteUrl: 'https://www.bing.com/search?q={q}', 
              isChecked: false 
            },
            { 
              siteName: 'DuckDuckGo Test', 
              icon: { public_id: 'duckduckgo_test', url: 'https://res.cloudinary.com/test/image/upload/duckduckgo_test.png' }, 
              siteUrl: 'https://duckduckgo.com/?q={q}', 
              isChecked: true 
            }
          ]
        },
        {
          categoryName: 'AI',
          description: 'AI tools for testing',
          url: [
            { 
              siteName: 'ChatGPT Test', 
              icon: { public_id: 'chatgpt_test', url: 'https://res.cloudinary.com/test/image/upload/chatgpt_test.png' }, 
              siteUrl: 'https://chat.openai.com/?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Claude Test', 
              icon: { public_id: 'claude_test', url: 'https://res.cloudinary.com/test/image/upload/claude_test.png' }, 
              siteUrl: 'https://claude.ai/new?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Perplexity Test', 
              icon: { public_id: 'perplexity_test', url: 'https://res.cloudinary.com/test/image/upload/perplexity_test.png' }, 
              siteUrl: 'https://www.perplexity.ai/search?q={q}', 
              isChecked: false 
            }
          ]
        },
        {
          categoryName: 'Video',
          description: 'Video platforms for testing',
          url: [
            { 
              siteName: 'YouTube Test', 
              icon: { public_id: 'youtube_test', url: 'https://res.cloudinary.com/test/image/upload/youtube_test.png' }, 
              siteUrl: 'https://www.youtube.com/results?search_query={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Vimeo Test', 
              icon: { public_id: 'vimeo_test', url: 'https://res.cloudinary.com/test/image/upload/vimeo_test.png' }, 
              siteUrl: 'https://vimeo.com/search?q={q}', 
              isChecked: false 
            }
          ]
        },
        {
          categoryName: 'Shopping',
          description: 'Shopping sites for testing',
          url: [
            { 
              siteName: 'Amazon Test', 
              icon: { public_id: 'amazon_test', url: 'https://res.cloudinary.com/test/image/upload/amazon_test.png' }, 
              siteUrl: 'https://www.amazon.com/s?k={q}', 
              isChecked: true 
            },
            { 
              siteName: 'eBay Test', 
              icon: { public_id: 'ebay_test', url: 'https://res.cloudinary.com/test/image/upload/ebay_test.png' }, 
              siteUrl: 'https://www.ebay.com/sch/i.html?_nkw={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Walmart Test', 
              icon: { public_id: 'walmart_test', url: 'https://res.cloudinary.com/test/image/upload/walmart_test.png' }, 
              siteUrl: 'https://www.walmart.com/search?q={q}', 
              isChecked: false 
            }
          ]
        },
        {
          categoryName: 'Social',
          description: 'Social media for testing',
          url: [
            { 
              siteName: 'Twitter Test', 
              icon: { public_id: 'twitter_test', url: 'https://res.cloudinary.com/test/image/upload/twitter_test.png' }, 
              siteUrl: 'https://twitter.com/search?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Reddit Test', 
              icon: { public_id: 'reddit_test', url: 'https://res.cloudinary.com/test/image/upload/reddit_test.png' }, 
              siteUrl: 'https://www.reddit.com/search/?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'LinkedIn Test', 
              icon: { public_id: 'linkedin_test', url: 'https://res.cloudinary.com/test/image/upload/linkedin_test.png' }, 
              siteUrl: 'https://www.linkedin.com/search/results/all/?keywords={q}', 
              isChecked: false 
            }
          ]
        },
        {
          categoryName: 'News',
          description: 'News sources for testing',
          url: [
            { 
              siteName: 'BBC Test', 
              icon: { public_id: 'bbc_test', url: 'https://res.cloudinary.com/test/image/upload/bbc_test.png' }, 
              siteUrl: 'https://www.bbc.co.uk/search?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'CNN Test', 
              icon: { public_id: 'cnn_test', url: 'https://res.cloudinary.com/test/image/upload/cnn_test.png' }, 
              siteUrl: 'https://edition.cnn.com/search?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Reuters Test', 
              icon: { public_id: 'reuters_test', url: 'https://res.cloudinary.com/test/image/upload/reuters_test.png' }, 
              siteUrl: 'https://www.reuters.com/search/news?blob={q}', 
              isChecked: false 
            }
          ]
        },
        {
          categoryName: 'Finance',
          description: 'Finance tools for testing',
          url: [
            { 
              siteName: 'Yahoo Finance Test', 
              icon: { public_id: 'yahoo_finance_test', url: 'https://res.cloudinary.com/test/image/upload/yahoo_finance_test.png' }, 
              siteUrl: 'https://finance.yahoo.com/quote/{q}', 
              isChecked: true 
            },
            { 
              siteName: 'TradingView Test', 
              icon: { public_id: 'tradingview_test', url: 'https://res.cloudinary.com/test/image/upload/tradingview_test.png' }, 
              siteUrl: 'https://www.tradingview.com/chart/?symbol={q}', 
              isChecked: true 
            }
          ]
        },
        {
          categoryName: 'Photo',
          description: 'Photo resources for testing',
          url: [
            { 
              siteName: 'Unsplash Test', 
              icon: { public_id: 'unsplash_test', url: 'https://res.cloudinary.com/test/image/upload/unsplash_test.png' }, 
              siteUrl: 'https://unsplash.com/s/photos/{q}', 
              isChecked: true 
            },
            { 
              siteName: 'Pexels Test', 
              icon: { public_id: 'pexels_test', url: 'https://res.cloudinary.com/test/image/upload/pexels_test.png' }, 
              siteUrl: 'https://www.pexels.com/search/{q}/', 
              isChecked: true 
            },
            { 
              siteName: 'Pixabay Test', 
              icon: { public_id: 'pixabay_test', url: 'https://res.cloudinary.com/test/image/upload/pixabay_test.png' }, 
              siteUrl: 'https://pixabay.com/images/search/{q}', 
              isChecked: false 
            }
          ]
        }
      ],
      preferences: {
        theme: i % 2 === 0 ? 'dark' : 'light'
      }
    };
    
    users.push(userData);
  }

  // Add some users with custom categories
  const customUsers = [
    {
      userId: 'customuser1',
      engine: [
        {
          categoryName: 'Custom Category 1',
          description: 'A custom category for testing',
          url: [
            { 
              siteName: 'Custom Site 1', 
              icon: { public_id: 'custom1', url: 'https://res.cloudinary.com/test/image/upload/custom1.png' }, 
              siteUrl: 'https://example1.com/search?q={q}', 
              isChecked: true 
            },
            { 
              siteName: 'Custom Site 2', 
              icon: { public_id: 'custom2', url: 'https://res.cloudinary.com/test/image/upload/custom2.png' }, 
              siteUrl: 'https://example2.com/search?q={q}', 
              isChecked: false 
            }
          ]
        }
      ],
      preferences: {
        theme: 'dark'
      }
    },
    {
      userId: 'customuser2',
      engine: [
        {
          categoryName: 'Empty Category',
          description: 'A category with no URLs for testing',
          url: []
        },
        {
          categoryName: 'Single URL Category',
          description: 'A category with only one URL',
          url: [
            { 
              siteName: 'Single Site', 
              icon: { public_id: 'single', url: 'https://res.cloudinary.com/test/image/upload/single.png' }, 
              siteUrl: 'https://single.com/search?q={q}', 
              isChecked: true 
            }
          ]
        }
      ],
      preferences: {
        theme: 'light'
      }
    }
  ];

  return [...users, ...customUsers];
}

// Function to insert test data into database
async function insertTestData() {
  try {
    const UserPreferences = require('../models/userPreferencesModel');
    const testData = generateTestData();
    
    console.log(`🗃️  Inserting ${testData.length} test users...`);
    
    // Clear existing test users
    await UserPreferences.deleteMany({ 
      userId: { $regex: /^(testuser|customuser)/ } 
    });
    
    // Insert new test data
    const result = await UserPreferences.insertMany(testData);
    
    console.log(`✅ Successfully inserted ${result.length} test users!`);
    console.log('\n📊 Test Users Created:');
    
    result.forEach(user => {
      const categoryCount = user.engine.length;
      const totalUrls = user.engine.reduce((sum, cat) => sum + cat.url.length, 0);
      console.log(`- ${user.userId}: ${categoryCount} categories, ${totalUrls} URLs`);
    });
    
    console.log('\n🧪 Test Commands:');
    console.log('- Get categories: curl "http://localhost:8484/api/user/category?userId=testuser1"');
    console.log('- Search: curl -X POST http://localhost:8484/api/user/search -H "Content-Type: application/json" -d \'{"userId":"testuser1","categoryName":"Search"}\'');
    console.log('- Register: curl -X POST http://localhost:8484/api/user/register -H "Content-Type: application/json" -d \'{"userId":"newuser123"}\'');
    
  } catch (error) {
    console.error('❌ Error inserting test data:', error);
  }
}

// Function to get test data without inserting
function getTestData() {
  return generateTestData();
}

module.exports = {
  generateTestData,
  insertTestData,
  getTestData
};

// If run directly, insert test data
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cosearch')
    .then(() => {
      console.log('✅ Connected to MongoDB');
      return insertTestData();
    })
    .then(() => {
      console.log('🎉 Test data insertion complete!');
      mongoose.disconnect();
    })
    .catch(err => {
      console.error('❌ Database connection failed:', err);
      process.exit(1);
    });
} 