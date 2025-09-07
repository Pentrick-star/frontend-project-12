# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - link "Hexlet Chat" [ref=e6] [cursor=pointer]:
        - /url: /
    - generic [ref=e11]:
      - img "Login illustration" [ref=e13]
      - generic [ref=e15]:
        - heading "Войти" [level=2] [ref=e16]
        - generic [ref=e17]:
          - generic [ref=e18]:
            - generic [ref=e19]: Ваш ник
            - textbox "Ваш ник" [ref=e20]
            - generic [ref=e21]: Обязательное поле
          - generic [ref=e22]:
            - generic [ref=e23]: Пароль
            - textbox "Пароль" [ref=e24]: pass
          - button "Войти" [ref=e25] [cursor=pointer]
        - generic [ref=e26]:
          - generic [ref=e27]: Нет аккаунта?
          - link "Регистрация" [ref=e28] [cursor=pointer]:
            - /url: /signup
    - region "Notifications Alt+T"
  - region "Notifications Alt+T"
```