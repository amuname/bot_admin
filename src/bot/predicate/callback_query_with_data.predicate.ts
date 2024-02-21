import { Update, CallbackQuery } from 'telegraf/types';
// import { CallbackQuery }
import Context from 'telegraf/typings/context';

// export type ContextUpdateWithMesssageWithText= Context<Update> & { message: { text: 'string' } };
// export function predicateContextWithMessageWithText(ctx: Context<Update>) : ctx is ContextUpdateWithMesssageWithText {
//     return (ctx as ContextUpdateWithMesssageWithText).message.text !== undefined
// }

export function predicateCallbackQueryWithData(
  message: Context<Update>['callbackQuery'],
): message is Context<Update>['callbackQuery'] & CallbackQuery.DataQuery {
  return (
    (message as Context<Update>['callbackQuery'] & CallbackQuery.DataQuery)
      .data !== undefined
  );
}
