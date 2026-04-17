# Kata Trivia

This is a small trivia app built in a few hours using Typescript and React while fetching data from Open Trivia Database.

## Code

All the code for this project is located in `/src/`. This project uses Typescript for it's code and css modules for styling. `QuizController.tsx` holds all logic for running the quiz while using `Home.tsx`, `Question.tsx`, and `Results.tsx` as it's main views. `Spinner.tsx` and `Timer.tsx` are just small visuals used in other compoenents. All unique styles for a component are sotred in it's css module if it has any, and re-used styles are stored in `common.module.css`.

## Running

This app is hosted on github pages at 

[mattriggle05.github.io/kata/](https://mattriggle05.github.io/kata/)

You can also run the dev version locally by cloning the repository and running

```
npm run dev
```

or host the production version locally by running

```
npm run build
npm run preveiw
```
