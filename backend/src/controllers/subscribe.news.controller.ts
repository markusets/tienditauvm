import { Request, Response } from 'express';
import { initDataSource } from '../db/data.source';
import { SubscriptionNews } from '../entities/subscription.news.entity';
import { SubscriptionNewsDTO } from '../dtos/subscription.news.dto';

export class SubscriptionNewsController {
  static async subscribeNews(req: Request, res: Response) {
    const { subscribeEmail } = req.body;
    if (!subscribeEmail) {
      res.status(400).json({ status: false, message: "Email is required" })
      return
    }
    const findEmail = await initDataSource.
      getRepository(SubscriptionNews).
      findOne({ where: { subscribeEmail } });
    if (findEmail) {
      res.status(409).json({ status: false, message: "Conflict Email already exists" })
      return
    }
    const subscription = new SubscriptionNews();
    subscription.subscribeEmail = subscribeEmail;
    const subscriptionRepository = initDataSource.getRepository(SubscriptionNews);
    await subscriptionRepository.save(subscription);
    const subscriptionDataSent = new SubscriptionNewsDTO();
    subscriptionDataSent.id = subscription.id
    subscriptionDataSent.subscribeEmail = subscription.subscribeEmail;
    res
      .status(200)
      .json({ status: true, message: "Subscription created successfully", subscriptionDataSent });
    return
  }
  static async unsubscribeNews(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const subscriptionRepository = initDataSource.getRepository(SubscriptionNews);
    const subscription = await subscriptionRepository.findOne({ where: { id } });
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return
    }
    await subscriptionRepository.remove(subscription)
    res.status(200).json({ status: true, message: "Subscription deleted successfully" });
    return
  }
}
