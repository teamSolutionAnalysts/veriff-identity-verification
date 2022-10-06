import { validate } from "class-validator";

export class Model {
  public static async getModel(model, body, query?): Promise<Model> {
    try {
      const m2 = new model(body, query);
      const errors = await validate(m2);
      if (errors.length) {
        throw errors;
      }
      return m2;
    } catch (error) {
      throw error;
    }
  }
}
