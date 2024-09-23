# BAKI

### Video Demo:  https://youtu.be/T75ZntdJIj4

---

### About the App 


#### Background 
My father runs a small shop. Sometimes, customers come in and take services or goods in credit,
and he does not have a proper system to keep those records. As such, some of them goes unpaid. 

This app was designed specifically to cater to this situation. While there are many professional apps
available on the marketplace, they are usually heavy-handed and comes with a lot of features that's
rather confusing for my father who isn't tech-savvy.

The word 'Baki' is a local term, that means credit. 

---

#### What it does
It keeps track of credit transactions, with options to clear it once paid.

---

#### Features 
- Record partially paid or unpaid transactions
- A Dashboard to show -
  1. Total outstanding credit
  2. The largest credit
  3. Most frequent credit customer
  4. The oldest unpaid credit
- Recent page, showing transactions of last 7 days
- Transactions Page that shows -
  1. Item purchased
  2. Customer name
  3. Credit amount
  4. Date of Transaction
  5. Note if recorded any
  6. Option to remove the transaction if paid
- New Entry page to record a new transaction that has -
  1. An option to choose a date from a spinner
  2. Name entry field has auto suggestions to show existing customers as you type
- Customers Page that shows -
  1. Name of customer and the total outstanding amount owed
  2. Option to edit the customer's name
  3. Option to delete the customer which will naturally delete all related transactions

---

### Tech stack I used and why

#### 1. React Native
Even though the app is simple, I wanted to dive into learning Kotlin and make a truly native app.
But then as I started learning, it didn't feel like a good idea because the learning curve was steeper than
what I anticipated and the time constraints.

I am already comfortable with JavaScript and wanted to use the same to build the app. Then I came across
React Native and read more about it. I read how it can build cross platforms apps from the same codebase
and that too with native components. 

I also read about Flutter, but that again requires I learn a new language Dart. 

So I went with React Native for my app.I wanted a native app and not something that ran inside a webView.
So that's also one of the reasons why I went with React Native.

#### 2. Expo Framework
Expo offers a complete set of tools and native API access to make the build process a breeze from start to finish. It manages
both ios and android code bases for you so you can focus more on the designing and building the logic
than to spend more time learning and managing platform dependent tools. 

It provides a live development server that is very easy to use and with just one command you can have your
project be built into an android or an ios app. `eas build --platform all` How cool is that?

Expo also makes it super easy to deploy your app to appstore and playstore by taking on all the complex parts
themselves. Not only that, same goes for updates.

#### 3. SQLite
For Data storage I used SQLite. Because I wanted my app to work offline. And since I already had a quite a lot of practice
in the detective problem set in CS50, I was equipped more than enough to handle SQLite for this project. I used EXPO-SQLite
as it made CRUD process easier and also because it integrates with the Expo framework seamlessly.

#### 4. Webstorm
I used webstorm as my IDE for this project. Webstorm has some great features that makes the development
a lot faster by way of code completion, great refactoring tools. Webstorm for one, made it a lot easier to copy
lines of code to other component files, and it would automatically copy the dependency library to the other file.

I started with VSCode, but even after trying a lot, I could not figure out a way for VSCode to
auto complete JSX for me. I would have to manually type in JSX Component tags, which became frustrating.

I also tried Zed, the new cool kid in town. Which appears very promising, and superfast, but does not offer mature toolsets
like the established editors like VSCode and Webstorm do.

#### 5. Android Studio
I used Android Studio to monitor my app development process in real time by leveraging the emulator tool it provides.
It has the option to set up emulators for various device specifications so that you know how the app will do in differing environments.

#### 6. NPM
For Package Manager, I used NPM. It makes installing and integrating 3rd party libraries a lot easier.

#### 7. Figma
I used figma to create a design and build a prototype of my app, for reference.

---

### Challenges I faced

#### 1. Setting up the database
I struggled quite a lot trying to get the SQLite Database working. As the app was failing to initialize 
the database when it would start for the first time. It would take a lot of manual tinkering to get the tables setup.

I almost felt like giving up due to this reason alone. I was stuck in this for days. Tried different options, like using
other ORMs like Watermelon, Drizzle. 

And what saved my day? A plugin from Drizzle. It lets you monitor your database live as you are working. This helped me
figure out the problems and solve it. 

#### 2. Figuring out ways to use the database globally across all pages in my screen
This was another area that took a lot of time. I didn't have a way to access the database seamlessly after initializing once
at the start.

I then came across React 'Context API'. Then allowed me to initialise the database once and use it everywhere
to run my CRUD operations easily.

#### 3. Sliding left to reveal delete and edit options
I spent a significant amount of time trying to figure out ways to make sliding a particular list item show
edit and delete option when slided to left. Finally, managed to made it work, it can still be better. But for now, I am happy
with it.

