# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - link "Hexlet Chat" [ref=e6] [cursor=pointer]:
      - /url: /
  - generic [ref=e11]:
    - img "Signup illustration" [ref=e13]
    - generic [ref=e15]:
      - heading "Регистрация" [level=2] [ref=e16]
      - alert [ref=e17]: Такой пользователь уже существует
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: Имя пользователя
          - textbox "Имя пользователя" [ref=e21]: user2
        - generic [ref=e22]:
          - generic [ref=e23]: Пароль
          - textbox "Пароль" [ref=e24]: password
        - generic [ref=e25]:
          - generic [ref=e26]: Подтвердите пароль
          - textbox "Подтвердите пароль" [ref=e27]: password
        - button "Зарегистрироваться" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]: Уже есть аккаунт?
        - link "Войти" [ref=e31] [cursor=pointer]:
          - /url: /login
  - region "Notifications Alt+T"
```