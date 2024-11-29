import { Router } from 'express';
import { SubscriptionNewsController } from '../controllers/subscribe.news.controller';

const router = Router();

router.post('/subscribe', SubscriptionNewsController.subscribeNews);

export { router as subscriptionNewsRouter }
