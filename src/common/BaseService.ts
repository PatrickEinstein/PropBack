import { Document, Model, Schema } from 'mongoose';
import { FetchQueryDto } from './fetch-query.dto';

export interface Query extends FetchQueryDto, Record<string, any> {}

export class BaseService {
  protected async getPaginatedReponse<T extends Document>(
    query: Query,
    model: Model<T>,
  ) {
    const { page, count } = query;
    const skip = !page || isNaN(Number(page)) ? 1 : Number(page);
    const limit = !count || isNaN(Number(count)) ? 10 : Number(count);
    const populate = query.populate || '';
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const createdAtObj: Record<string, any> = {};
    let isDateFilter = false;
    if (String(new Date(query.from)) !== 'Invalid Date') {
      createdAtObj.$gte = new Date(query.from);
      isDateFilter = true;
    }
    if (String(new Date(query.to)) !== 'Invalid Date') {
      createdAtObj.$lte = new Date(query.to);
      isDateFilter = true;
    }

    delete query.to;
    delete query.page;
    delete query.from;
    delete query.count;
    delete query.sortBy;
    delete query.populate;
    delete query.sortOrder;

    const cleanQuery = this.buildTruthyObject(query);
    const data = await model
      .find({ ...cleanQuery, ...(isDateFilter && { createdAt: createdAtObj }) })
      .populate(populate)
      .skip((skip - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    const total = await model.find(cleanQuery).countDocuments();
    const totalPages = Math.ceil(total / limit);
    const size = data.length;

    return {
      data,
      page: skip,
      totalPages,
      total: size,
    };
  }

  protected buildTruthyObject<T extends Record<string, any>>(
    body: T,
  ): Partial<T> {
    return Object.entries(body).reduce(
      (acc, [key, value]) => (body[key] ? { ...acc, [key]: value } : acc),
      {},
    );
  }

  protected isDocument<T extends Document>(
    obj: T | string | Schema.Types.ObjectId | undefined | null,
  ): obj is T {
    if (
      !obj ||
      typeof obj === 'string' ||
      obj instanceof Schema.Types.ObjectId
    ) {
      return false;
    }
    return true;
  }
}
