# Operation Lemontree

Operation Lemontree is a mobile app that connects people in a community to share
items they no longer need. Users can upload items they want to give away, browse
items that are available, and start conversations about items they are
interested in.

The original framework, design of the app, and code was developed by
[Josie Daw](https://github.com/JosDaw).

You can visit the web demo [here](https://operation-lemontree.netlify.app/).

_Sharing is caring: Discover, connect, and give back with Lemontree._

## Badges

![License](https://img.shields.io/badge/license-Non--Commercial-blue)
![Contributors](https://img.shields.io/github/contributors/JosDaw/operation-lemontree)

## Table of Contents

- [Who Can Use This Project?](#who-can-use-this-project)
- [Features](#app-features)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [How to Create Your Own Lemontree App](#how-to-create-your-own-lemontree-app)
  - [Firebase Setup](#firebase-setup)
  - [Google Maps API Setup (For Geocoding)](#google-maps-api-setup-for-geocoding)
  - [Supabase Setup](#supabase-setup)
  - [Firebase Indexes](#firebase-indexes)
  - [How to Change Categories](#how-to-change-categories)
  - [How to set up Expo Eas](#how-to-set-up-expo-eas)
  - [Things to Remember Before Deploying to Production](#things-to-remember-before-deploying-to-production)
- [Contributing](#contributing)
- [Community](#community)
- [License](#license)
- [Web Demo](#web-demo)
  - [How to Deploy An Expo App To Netlify](#how-to-deploy-an-expo-app-to-netlify)

## Who Can Use This Project?

This project was designed to showcase different features of a production-lite
Expo app. It is encouraged to be used as a learning tool for developers who are
new to React Native and Expo.

This project is open-source and free to use for non-commercial purposes. You can
read the full license in the [LICENSE](./LICENSE) file.

If you would like to use any part of this project for commercial purposes,
please contact the original author, [Josie Daw](https://github.com/JosDaw).

## App Features

- Search Items: Users can search for items by category or keyword. They will be
  filtered by location if the user is logged in.
- Favourites: Users can save items they are interested in to their favourites
  list.
- Chat: Users can chat with other users to arrange pick-up or delivery of items.
- Upload Items: Users can upload items they want to give away, including
  descriptions and photos.
- Moderation: Items are moderated before they are published to the app.
- Notifications: Users receive notifications when they have a new message.
- Reporting: Users can report items and users that are inappropriate.
- User Profiles: Users can view their profile information and manage their
  uploaded items.

## Installation

To get started with the Lemontree app, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/JosDaw/operation-lemontree.git
cd operation-lemontree
```

2. Install dependencies:

Make sure you have Node.js and Expo CLI installed on your machine.

Install the required dependencies by running:

```bash

npm install
```

3. Start the Expo server:

Start the Expo development server using the command:

```bash
npx expo start
```

This will launch the Expo Metro. You can then run the app on your iOS or Android
device by scanning the QR code or use an emulator. (You may need to press s to
switch to Expo Go.)

## Technologies Used

- React Native: Cross-platform mobile app framework for building the app.
- Expo: A framework and platform for universal React applications.
- Firebase: For authentication, storage, and real-time database needs.
- Supabase: For image storage.
- Push Notifications: For notifying users about their requested items.

## Screenshots

## Documentation

This app has documentation generated from JSDoc comments. To view the
documentation, go to docs/index.html and open it in your browser.

## How to Create Your Own Lemontree App

### Firebase Setup

1. Follow the installation steps
2. Create a Firebase project and set up Firebase authentication, storage, and
   real-time database.
   - Authentication: select Email/Password, for Sign-in providers select
     Email/Password enabled
   - Firestore Database: create database in your region, start in test mode
     (make sure to update this later with the Firestore rules)
   - Storage: (you may need to upgrade your account to Blaze to use this or use
     Supabase): create a storage bucket
3. Click Project Settings > Your apps > Add app > Web and copy the firebase
   configuration into your .env files.
   - It is recommended to create two projects (one for development and one for
     production) and use the appropriate configuration for each into .env.local
     and .env.production files.
4. Add an android app with your app name. Make sure to make an original package
   name and align it with your name in the app.config.ts. Get the
   google-services.json file from Firebase and add it to the project.

### Google Maps API Setup (For Geocoding)

Visit the Google Maps API onboarding:
<https://console.cloud.google.com/google/maps-apis/>

1. Create a new project. (You will need to enable billing to use the API, but
   Google offers a $200 free credit for new users.)
2. Enable the Geocoding API.
3. Create an API key on the Keys & Credentials page (Click the Create
   Credentials button near the top of the page.)
4. Add the API key to the .env files.

### Supabase Setup

1. Create a free account on Supabase: <https://supabase.com/dashboard/sign-up>
2. Create a new project/database (make sure to write down your database
   password!)
3. Add the Project URL and API Key to the .env files.
4. Click Buckets -> Create new bucket -> Add a name and click Save

- Enable Public access
- Make sure to select Additional Configuration to limit the file upload size

5. Add the bucket name to the .env files.
6. Select the bucket and add bucket policies for read/write access
7. In the API settings, add storage to the exposed schemas

- Create the following new custom policies:

**Public Read Access** Policy Name: public read access Operation: SELECT (this
is for read access) Apply Policy: Set to All objects in the bucket Policy
Definition: true

**Authenticated Upload Access** Policy Name: authenticated upload access Allowed
Operation: Select the INSERT checkbox (for uploading new files). Target Roles:
Leave as Defaults to all (public) roles. Policy Definition: Use this SQL:
`auth.jwt() IS NOT NULL AND bucket_id = 'lemontree'`

**Delete Own Files** Policy Name: delete own files Allowed Operation: DELETE.
Target Roles: Leave as Defaults to all (public) roles. Policy Definition: Use
this SQL:

```sql
(
  bucket_id = 'lemontree'
  AND auth.jwt() ->> 'sub' = (regexp_split_to_array(storage.objects.name, '/'))[1]
)
```

### Firebase Indexes

As you navigate through the app, you will encounter an error message telling you
to create an index. You can copy and paste the message from your terminal into
your browser to create the index.

Note: indexes can take a few minutes to create. If you encounter an error, wait
a few minutes and try again.

### How to Change Categories

To change the categories, go to the `app/constants/constants.ts` file and update
the categories array with your desired categories.

You can use icons from <https://icons.expo.fyi/Index> to add icons to your
categories.

### How to set up Expo Eas

1. Install the Expo CLI:

```bash
npm install -g eas-cli
```

2. Log in to your Expo account:

```bash
eas login
```

3. Run eas configure to set up your project:

```bash
eas update:configure
```

4. Update the projectId in the app.config.ts file to match the project ID from
   the terminal.

### Things to Remember Before Deploying to Production

- Make sure to update all of the links to redirect users to real websites. (For
  example, the privacy policy, terms of service, and contact links.)
- Update the app name, description, and icon in the app.config.ts file.
- Make sure that the app secrets are uploaded to Expo.
- Make sure that access to Firebase and Supabase is secure and that the rules
  are set up correctly.
- Make sure that you have set up the indexes for every combined Firebase query,
  otherwise some functions will not work. (The app will show an error and you
  can see the link to create the index in the terminal.)

## Community

Join our growing community to share feedback, ask questions, and contribute:

- **GitHub Discussions**:
  [Operation Lemontree Discussions](https://github.com/JosDaw/operation-lemontree/discussions)
- **Issues**: Found a bug?
  [Report it here](https://github.com/JosDaw/operation-lemontree/issues)

## Contributing

We welcome contributions to Operation Lemontree! Whether you're fixing bugs,
adding features, or improving documentation, your help is appreciated.

Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a
pull request or reporting an issue.

## License

This project is licensed under a custom **Non-Commercial Use License**. See the
[LICENSE](./LICENSE) file for details.

**Important Note**: This project is restricted from use by MONA Co., Ltd or its
affiliates. See the license for specifics.

## Web Demo

This project is not intended to be used as a web app. The web demo is provided
as a convenience for users to preview the app. It is recommended to use the app
on a mobile device for the best experience.

You can find the web demo [here](https://operation-lemontree.netlify.app/).

### How to Deploy An Expo App To Netlify

Update the app.config.ts to include the web build settings:

```json
"web":
{
  "output": "single",
  "bundler": "metro"
}
```

Create a build (you will need to do this ever single time you make changes that
you want to be deployed).

```bash
npx expo export -p web
```

Install the Netlify CLI `npm install -g netlify-cli`

Create a new folder in your root called `.public`.

Add a new file to the `.public` folder called `_redirects` (no file type) with
the following content:

```bash
/*    /index.html   200
```

Deploy the web build and follow the directions on the terminal. It will ask you
to log in/authorise Netlify.

```bash
netlify deploy --dir dist
```

On the first instance, you will need to select a new project and your team. When
it asks you which build folder to use, type `dist`.

On subsequent deployments, you just need to build and deploy:

```bash
npx expo export -p web
netlify deploy --dir dist
```

Confirm the draft URL has updated, then `netlify deploy --prod` to deploy to
production.
