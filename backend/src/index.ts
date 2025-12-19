import 'dotenv/config';
import { createApp } from './app';

const PORT = process.env.PORT || 3001;

const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
});
