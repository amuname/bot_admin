import { handler } from "../src";

describe('тестирую запуск бота', ()=>{
    it('должен запустиь бота в режиме теста, дождаться сообщений от пользователя и выключиться', ()=>{
        handler({}, {})
    })
    it('должен запустиь бота в режиме прода, получить сообщение старт и вернуть что-то', ()=> {})
})