const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = path.join(__dirname, '..', 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = [];
const keywordFreq = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { data, content: body } = matter(content);
  const keywords = data.keywords || [];
  keywords.forEach(k => {
    keywordFreq[k] = (keywordFreq[k] || 0) + 1;
  });

  const keywordCounts = keywords.reduce((acc, kw) => {
    const regex = new RegExp(kw, 'gi');
    const count = (body.match(regex) || []).length;
    acc[kw] = count;
    return acc;
  }, {});

  const seo = {
    hasDescription: !!data.description,
    titleLength: data.title ? data.title.length : 0,
    keywordCounts
  };

  posts.push({
    ...data,
    seo
  });
}

const analysis = { posts, keywordFrequency: keywordFreq };
fs.writeFileSync(path.join(__dirname, '..', 'data.json'), JSON.stringify(analysis, null, 2));
console.log('Generated data.json');
