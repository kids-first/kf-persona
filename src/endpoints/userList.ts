import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from '../schema/userType';
import { generateMemberList } from '../services/csvGenerator';

export default (model: Model<User>) =>
    async (_req: Request, res: Response): Promise<void> => {
        await model
            .find({})
            .exec()
            .then((users) => generateMemberList(users, res))
            .catch((err) => {
                console.error(err);
                res.status(500).json(err);
            });
    };
