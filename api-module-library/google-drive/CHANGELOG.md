# v0.0.8 (Wed Jun 07 2023)

#### 🐛 Bug Fix

- google drive - auth fixes [#170](https://github.com/friggframework/frigg/pull/170) (michael.webber@lefthook.com [@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add helper method that checks status of a file upload session, which is a special case of the content upload request (PUT to session uri) (michael.webber@lefthook.com)
- add methods for resumable file upload (michael.webber@lefthook.com)
- update debug log message to indicate the correct externalId (michael.webber@lefthook.com)
- fixes to credential model and db upsert (michael.webber@lefthook.com)
- Add test for the refresh_token (and access_token) (michael.webber@lefthook.com)
- google auth spec wants the default behavior of getTokenFromCode, even though the AuthHeader style was working. (michael.webber@lefthook.com)
- Bump independent versions \[skip ci\] ([@seanspeaks](https://github.com/seanspeaks))

#### Authors: 3

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Michael Webber (michael.webber@lefthook.com)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.7 (Fri May 26 2023)

#### 🐛 Bug Fix

- Trailing Slash removal for Google Drive [#166](https://github.com/friggframework/frigg/pull/166) ([@seanspeaks](https://github.com/seanspeaks))
- trailing slash removal ([@seanspeaks](https://github.com/seanspeaks))
- Use the method [#164](https://github.com/friggframework/frigg/pull/164) ([@seanspeaks](https://github.com/seanspeaks))
- Live state retrieval (getAuthorizationUri method override) [#163](https://github.com/friggframework/frigg/pull/163) ([@seanspeaks](https://github.com/seanspeaks))
- Add support for state param [#162](https://github.com/friggframework/frigg/pull/162) ([@seanspeaks](https://github.com/seanspeaks))
- Need to add publishConfig for public first time publishing [#159](https://github.com/friggframework/frigg/pull/159) ([@seanspeaks](https://github.com/seanspeaks))
- allow root request to pass query (in case verbose data is needed) [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving the root folder of My Drive [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving drives [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add convenience function for listing folders [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic functionality for google-drive api module complete [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial manager and manager.test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- individual file details and data retrieval [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- lint fixes [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- folder search test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic files request working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- auth is working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial commit of google-drive api module from generator [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 2

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.6 (Fri May 26 2023)

#### 🐛 Bug Fix

- :face-palm: [#164](https://github.com/friggframework/frigg/pull/164) ([@seanspeaks](https://github.com/seanspeaks))
- Use the method ([@seanspeaks](https://github.com/seanspeaks))
- Live state retrieval (getAuthorizationUri method override) [#163](https://github.com/friggframework/frigg/pull/163) ([@seanspeaks](https://github.com/seanspeaks))
- Add support for state param [#162](https://github.com/friggframework/frigg/pull/162) ([@seanspeaks](https://github.com/seanspeaks))
- Need to add publishConfig for public first time publishing [#159](https://github.com/friggframework/frigg/pull/159) ([@seanspeaks](https://github.com/seanspeaks))
- allow root request to pass query (in case verbose data is needed) [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving the root folder of My Drive [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving drives [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add convenience function for listing folders [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic functionality for google-drive api module complete [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial manager and manager.test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- individual file details and data retrieval [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- lint fixes [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- folder search test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic files request working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- auth is working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial commit of google-drive api module from generator [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 2

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.5 (Fri May 26 2023)

#### 🐛 Bug Fix

- Override getAuthorizationUri [#163](https://github.com/friggframework/frigg/pull/163) ([@seanspeaks](https://github.com/seanspeaks))
- Live state retrieval (getAuthorizationUri method override) ([@seanspeaks](https://github.com/seanspeaks))
- Add support for state param [#162](https://github.com/friggframework/frigg/pull/162) ([@seanspeaks](https://github.com/seanspeaks))
- Need to add publishConfig for public first time publishing [#159](https://github.com/friggframework/frigg/pull/159) ([@seanspeaks](https://github.com/seanspeaks))
- allow root request to pass query (in case verbose data is needed) [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving the root folder of My Drive [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving drives [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add convenience function for listing folders [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic functionality for google-drive api module complete [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial manager and manager.test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- individual file details and data retrieval [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- lint fixes [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- folder search test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic files request working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- auth is working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial commit of google-drive api module from generator [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 2

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.4 (Fri May 26 2023)

#### 🐛 Bug Fix

- Add state param support for google drive [#162](https://github.com/friggframework/frigg/pull/162) ([@seanspeaks](https://github.com/seanspeaks))
- Add support for state param ([@seanspeaks](https://github.com/seanspeaks))
- Need to add publishConfig for public first time publishing [#159](https://github.com/friggframework/frigg/pull/159) ([@seanspeaks](https://github.com/seanspeaks))
- allow root request to pass query (in case verbose data is needed) [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving the root folder of My Drive [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving drives [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add convenience function for listing folders [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic functionality for google-drive api module complete [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial manager and manager.test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- individual file details and data retrieval [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- lint fixes [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- folder search test working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic files request working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- auth is working [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial commit of google-drive api module from generator [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 2

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.3 (Thu May 25 2023)

#### 🐛 Bug Fix

- Support calling localhost for ironclad api [#160](https://github.com/friggframework/frigg/pull/160) ([@debbie-yu](https://github.com/debbie-yu))

#### Authors: 1

- [@debbie-yu](https://github.com/debbie-yu)

---

# v0.0.2 (Wed May 24 2023)

#### 🐛 Bug Fix

- Need to add publishConfig for public first time publishing [#159](https://github.com/friggframework/frigg/pull/159) ([@seanspeaks](https://github.com/seanspeaks))
- Need to add publishConfig for public first time publishing ([@seanspeaks](https://github.com/seanspeaks))
- Google Drive API module [#154](https://github.com/friggframework/frigg/pull/154) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- allow root request to pass query (in case verbose data is needed) ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving the root folder of My Drive ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add method for retrieving drives ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- add convenience function for listing folders ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic functionality for google-drive api module complete ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial manager and manager.test working ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- individual file details and data retrieval ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- lint fixes ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- folder search test working ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- basic files request working ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- auth is working ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))
- initial commit of google-drive api module from generator ([@MichaelRyanWebber](https://github.com/MichaelRyanWebber))

#### Authors: 2

- [@MichaelRyanWebber](https://github.com/MichaelRyanWebber)
- Sean Matthews ([@seanspeaks](https://github.com/seanspeaks))

---

# v0.0.1 (May 02 2023)

#### Generated
- Initialized from template
