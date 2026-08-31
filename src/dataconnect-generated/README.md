# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyUser*](#getmyuser)
  - [*ListAllUsers*](#listallusers)
  - [*GetConsultationRequest*](#getconsultationrequest)
  - [*ListMyConsultationRequests*](#listmyconsultationrequests)
  - [*GetSession*](#getsession)
  - [*ListUpcomingSessions*](#listupcomingsessions)
  - [*GetReview*](#getreview)
  - [*ListReviewsForSession*](#listreviewsforsession)
  - [*GetSkill*](#getskill)
  - [*ListAllSkills*](#listallskills)
  - [*GetUserSkills*](#getuserskills)
  - [*ListUsersWithSkill*](#listuserswithskill)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserBio*](#updateuserbio)
  - [*DeleteUser*](#deleteuser)
  - [*CreateConsultationRequest*](#createconsultationrequest)
  - [*UpdateRequestStatus*](#updaterequeststatus)
  - [*DeleteConsultationRequest*](#deleteconsultationrequest)
  - [*CreateConsultationSession*](#createconsultationsession)
  - [*UpdateSessionNotes*](#updatesessionnotes)
  - [*DeleteConsultationSession*](#deleteconsultationsession)
  - [*CreateReview*](#createreview)
  - [*UpdateReview*](#updatereview)
  - [*DeleteReview*](#deletereview)
  - [*CreateSkill*](#createskill)
  - [*UpdateSkill*](#updateskill)
  - [*DeleteSkill*](#deleteskill)
  - [*AddUserSkill*](#adduserskill)
  - [*RemoveUserSkill*](#removeuserskill)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyUser
You can execute the `GetMyUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyUser(options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface GetMyUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserData, undefined>;
}
export const getMyUserRef: GetMyUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface GetMyUserRef {
  ...
  (dc: DataConnect): QueryRef<GetMyUserData, undefined>;
}
export const getMyUserRef: GetMyUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyUserRef:
```typescript
const name = getMyUserRef.operationName;
console.log(name);
```

### Variables
The `GetMyUser` query has no variables.
### Return Type
Recall that executing the `GetMyUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyUserData {
  user?: {
    displayName: string;
    email: string;
    bio?: string | null;
  };
}
```
### Using `GetMyUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyUser } from '@dataconnect/generated';


// Call the `getMyUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyUserRef } from '@dataconnect/generated';


// Call the `getMyUserRef()` function to get a reference to the query.
const ref = getMyUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListAllUsers
You can execute the `ListAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface ListAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
}
export const listAllUsersRef: ListAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllUsersRef:
```typescript
const name = listAllUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllUsers` query has no variables.
### Return Type
Recall that executing the `ListAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllUsersData {
  users: ({
    displayName: string;
    role: string;
  })[];
}
```
### Using `ListAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllUsers } from '@dataconnect/generated';


// Call the `listAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllUsersRef } from '@dataconnect/generated';


// Call the `listAllUsersRef()` function to get a reference to the query.
const ref = listAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetConsultationRequest
You can execute the `GetConsultationRequest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getConsultationRequest(vars: GetConsultationRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetConsultationRequestData, GetConsultationRequestVariables>;

interface GetConsultationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConsultationRequestVariables): QueryRef<GetConsultationRequestData, GetConsultationRequestVariables>;
}
export const getConsultationRequestRef: GetConsultationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getConsultationRequest(dc: DataConnect, vars: GetConsultationRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetConsultationRequestData, GetConsultationRequestVariables>;

interface GetConsultationRequestRef {
  ...
  (dc: DataConnect, vars: GetConsultationRequestVariables): QueryRef<GetConsultationRequestData, GetConsultationRequestVariables>;
}
export const getConsultationRequestRef: GetConsultationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getConsultationRequestRef:
```typescript
const name = getConsultationRequestRef.operationName;
console.log(name);
```

### Variables
The `GetConsultationRequest` query requires an argument of type `GetConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetConsultationRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetConsultationRequest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetConsultationRequestData {
  consultationRequest?: {
    title: string;
    status: string;
    requester: {
      displayName: string;
    };
  };
}
```
### Using `GetConsultationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getConsultationRequest, GetConsultationRequestVariables } from '@dataconnect/generated';

// The `GetConsultationRequest` query requires an argument of type `GetConsultationRequestVariables`:
const getConsultationRequestVars: GetConsultationRequestVariables = {
  id: ..., 
};

// Call the `getConsultationRequest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getConsultationRequest(getConsultationRequestVars);
// Variables can be defined inline as well.
const { data } = await getConsultationRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getConsultationRequest(dataConnect, getConsultationRequestVars);

console.log(data.consultationRequest);

// Or, you can use the `Promise` API.
getConsultationRequest(getConsultationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest);
});
```

### Using `GetConsultationRequest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getConsultationRequestRef, GetConsultationRequestVariables } from '@dataconnect/generated';

// The `GetConsultationRequest` query requires an argument of type `GetConsultationRequestVariables`:
const getConsultationRequestVars: GetConsultationRequestVariables = {
  id: ..., 
};

// Call the `getConsultationRequestRef()` function to get a reference to the query.
const ref = getConsultationRequestRef(getConsultationRequestVars);
// Variables can be defined inline as well.
const ref = getConsultationRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getConsultationRequestRef(dataConnect, getConsultationRequestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.consultationRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest);
});
```

## ListMyConsultationRequests
You can execute the `ListMyConsultationRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyConsultationRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyConsultationRequestsData, undefined>;

interface ListMyConsultationRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyConsultationRequestsData, undefined>;
}
export const listMyConsultationRequestsRef: ListMyConsultationRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyConsultationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyConsultationRequestsData, undefined>;

interface ListMyConsultationRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyConsultationRequestsData, undefined>;
}
export const listMyConsultationRequestsRef: ListMyConsultationRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyConsultationRequestsRef:
```typescript
const name = listMyConsultationRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListMyConsultationRequests` query has no variables.
### Return Type
Recall that executing the `ListMyConsultationRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyConsultationRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyConsultationRequestsData {
  consultationRequests: ({
    title: string;
    status: string;
  })[];
}
```
### Using `ListMyConsultationRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyConsultationRequests } from '@dataconnect/generated';


// Call the `listMyConsultationRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyConsultationRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyConsultationRequests(dataConnect);

console.log(data.consultationRequests);

// Or, you can use the `Promise` API.
listMyConsultationRequests().then((response) => {
  const data = response.data;
  console.log(data.consultationRequests);
});
```

### Using `ListMyConsultationRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyConsultationRequestsRef } from '@dataconnect/generated';


// Call the `listMyConsultationRequestsRef()` function to get a reference to the query.
const ref = listMyConsultationRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyConsultationRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.consultationRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationRequests);
});
```

## GetSession
You can execute the `GetSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSession(vars: GetSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSessionData, GetSessionVariables>;

interface GetSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
}
export const getSessionRef: GetSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSession(dc: DataConnect, vars: GetSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSessionData, GetSessionVariables>;

interface GetSessionRef {
  ...
  (dc: DataConnect, vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
}
export const getSessionRef: GetSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSessionRef:
```typescript
const name = getSessionRef.operationName;
console.log(name);
```

### Variables
The `GetSession` query requires an argument of type `GetSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSessionData {
  consultationSession?: {
    status: string;
    notes?: string | null;
    mentor: {
      displayName: string;
    };
  };
}
```
### Using `GetSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSession, GetSessionVariables } from '@dataconnect/generated';

// The `GetSession` query requires an argument of type `GetSessionVariables`:
const getSessionVars: GetSessionVariables = {
  id: ..., 
};

// Call the `getSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSession(getSessionVars);
// Variables can be defined inline as well.
const { data } = await getSession({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSession(dataConnect, getSessionVars);

console.log(data.consultationSession);

// Or, you can use the `Promise` API.
getSession(getSessionVars).then((response) => {
  const data = response.data;
  console.log(data.consultationSession);
});
```

### Using `GetSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSessionRef, GetSessionVariables } from '@dataconnect/generated';

// The `GetSession` query requires an argument of type `GetSessionVariables`:
const getSessionVars: GetSessionVariables = {
  id: ..., 
};

// Call the `getSessionRef()` function to get a reference to the query.
const ref = getSessionRef(getSessionVars);
// Variables can be defined inline as well.
const ref = getSessionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSessionRef(dataConnect, getSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.consultationSession);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationSession);
});
```

## ListUpcomingSessions
You can execute the `ListUpcomingSessions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUpcomingSessions(options?: ExecuteQueryOptions): QueryPromise<ListUpcomingSessionsData, undefined>;

interface ListUpcomingSessionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUpcomingSessionsData, undefined>;
}
export const listUpcomingSessionsRef: ListUpcomingSessionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUpcomingSessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUpcomingSessionsData, undefined>;

interface ListUpcomingSessionsRef {
  ...
  (dc: DataConnect): QueryRef<ListUpcomingSessionsData, undefined>;
}
export const listUpcomingSessionsRef: ListUpcomingSessionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUpcomingSessionsRef:
```typescript
const name = listUpcomingSessionsRef.operationName;
console.log(name);
```

### Variables
The `ListUpcomingSessions` query has no variables.
### Return Type
Recall that executing the `ListUpcomingSessions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUpcomingSessionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUpcomingSessionsData {
  consultationSessions: ({
    startDate: TimestampString;
    status: string;
  })[];
}
```
### Using `ListUpcomingSessions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUpcomingSessions } from '@dataconnect/generated';


// Call the `listUpcomingSessions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUpcomingSessions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUpcomingSessions(dataConnect);

console.log(data.consultationSessions);

// Or, you can use the `Promise` API.
listUpcomingSessions().then((response) => {
  const data = response.data;
  console.log(data.consultationSessions);
});
```

### Using `ListUpcomingSessions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUpcomingSessionsRef } from '@dataconnect/generated';


// Call the `listUpcomingSessionsRef()` function to get a reference to the query.
const ref = listUpcomingSessionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUpcomingSessionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.consultationSessions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationSessions);
});
```

## GetReview
You can execute the `GetReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReviewRef:
```typescript
const name = getReviewRef.operationName;
console.log(name);
```

### Variables
The `GetReview` query requires an argument of type `GetReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReviewData {
  review?: {
    rating: number;
    comment: string;
    reviewer: {
      displayName: string;
    };
  };
}
```
### Using `GetReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReview, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReview(getReviewVars);
// Variables can be defined inline as well.
const { data } = await getReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReview(dataConnect, getReviewVars);

console.log(data.review);

// Or, you can use the `Promise` API.
getReview(getReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

### Using `GetReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReviewRef, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReviewRef()` function to get a reference to the query.
const ref = getReviewRef(getReviewVars);
// Variables can be defined inline as well.
const ref = getReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReviewRef(dataConnect, getReviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.review);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

## ListReviewsForSession
You can execute the `ListReviewsForSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReviewsForSession(vars: ListReviewsForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsForSessionData, ListReviewsForSessionVariables>;

interface ListReviewsForSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewsForSessionVariables): QueryRef<ListReviewsForSessionData, ListReviewsForSessionVariables>;
}
export const listReviewsForSessionRef: ListReviewsForSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReviewsForSession(dc: DataConnect, vars: ListReviewsForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsForSessionData, ListReviewsForSessionVariables>;

interface ListReviewsForSessionRef {
  ...
  (dc: DataConnect, vars: ListReviewsForSessionVariables): QueryRef<ListReviewsForSessionData, ListReviewsForSessionVariables>;
}
export const listReviewsForSessionRef: ListReviewsForSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReviewsForSessionRef:
```typescript
const name = listReviewsForSessionRef.operationName;
console.log(name);
```

### Variables
The `ListReviewsForSession` query requires an argument of type `ListReviewsForSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReviewsForSessionVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReviewsForSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReviewsForSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReviewsForSessionData {
  reviews: ({
    rating: number;
    comment: string;
  })[];
}
```
### Using `ListReviewsForSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReviewsForSession, ListReviewsForSessionVariables } from '@dataconnect/generated';

// The `ListReviewsForSession` query requires an argument of type `ListReviewsForSessionVariables`:
const listReviewsForSessionVars: ListReviewsForSessionVariables = {
  sessionId: ..., 
};

// Call the `listReviewsForSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReviewsForSession(listReviewsForSessionVars);
// Variables can be defined inline as well.
const { data } = await listReviewsForSession({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReviewsForSession(dataConnect, listReviewsForSessionVars);

console.log(data.reviews);

// Or, you can use the `Promise` API.
listReviewsForSession(listReviewsForSessionVars).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `ListReviewsForSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReviewsForSessionRef, ListReviewsForSessionVariables } from '@dataconnect/generated';

// The `ListReviewsForSession` query requires an argument of type `ListReviewsForSessionVariables`:
const listReviewsForSessionVars: ListReviewsForSessionVariables = {
  sessionId: ..., 
};

// Call the `listReviewsForSessionRef()` function to get a reference to the query.
const ref = listReviewsForSessionRef(listReviewsForSessionVars);
// Variables can be defined inline as well.
const ref = listReviewsForSessionRef({ sessionId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReviewsForSessionRef(dataConnect, listReviewsForSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

## GetSkill
You can execute the `GetSkill` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getSkill(vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface GetSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
}
export const getSkillRef: GetSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSkill(dc: DataConnect, vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface GetSkillRef {
  ...
  (dc: DataConnect, vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
}
export const getSkillRef: GetSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSkillRef:
```typescript
const name = getSkillRef.operationName;
console.log(name);
```

### Variables
The `GetSkill` query requires an argument of type `GetSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetSkill` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetSkillData {
  skill?: {
    name: string;
    category?: string | null;
  };
}
```
### Using `GetSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSkill, GetSkillVariables } from '@dataconnect/generated';

// The `GetSkill` query requires an argument of type `GetSkillVariables`:
const getSkillVars: GetSkillVariables = {
  id: ..., 
};

// Call the `getSkill()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSkill(getSkillVars);
// Variables can be defined inline as well.
const { data } = await getSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSkill(dataConnect, getSkillVars);

console.log(data.skill);

// Or, you can use the `Promise` API.
getSkill(getSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill);
});
```

### Using `GetSkill`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSkillRef, GetSkillVariables } from '@dataconnect/generated';

// The `GetSkill` query requires an argument of type `GetSkillVariables`:
const getSkillVars: GetSkillVariables = {
  id: ..., 
};

// Call the `getSkillRef()` function to get a reference to the query.
const ref = getSkillRef(getSkillVars);
// Variables can be defined inline as well.
const ref = getSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSkillRef(dataConnect, getSkillVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.skill);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.skill);
});
```

## ListAllSkills
You can execute the `ListAllSkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllSkills(options?: ExecuteQueryOptions): QueryPromise<ListAllSkillsData, undefined>;

interface ListAllSkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSkillsData, undefined>;
}
export const listAllSkillsRef: ListAllSkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSkillsData, undefined>;

interface ListAllSkillsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllSkillsData, undefined>;
}
export const listAllSkillsRef: ListAllSkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllSkillsRef:
```typescript
const name = listAllSkillsRef.operationName;
console.log(name);
```

### Variables
The `ListAllSkills` query has no variables.
### Return Type
Recall that executing the `ListAllSkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllSkillsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllSkillsData {
  skills: ({
    name: string;
    category?: string | null;
  })[];
}
```
### Using `ListAllSkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllSkills } from '@dataconnect/generated';


// Call the `listAllSkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllSkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllSkills(dataConnect);

console.log(data.skills);

// Or, you can use the `Promise` API.
listAllSkills().then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

### Using `ListAllSkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllSkillsRef } from '@dataconnect/generated';


// Call the `listAllSkillsRef()` function to get a reference to the query.
const ref = listAllSkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllSkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.skills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.skills);
});
```

## GetUserSkills
You can execute the `GetUserSkills` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserSkills(options?: ExecuteQueryOptions): QueryPromise<GetUserSkillsData, undefined>;

interface GetUserSkillsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserSkillsData, undefined>;
}
export const getUserSkillsRef: GetUserSkillsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillsData, undefined>;

interface GetUserSkillsRef {
  ...
  (dc: DataConnect): QueryRef<GetUserSkillsData, undefined>;
}
export const getUserSkillsRef: GetUserSkillsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserSkillsRef:
```typescript
const name = getUserSkillsRef.operationName;
console.log(name);
```

### Variables
The `GetUserSkills` query has no variables.
### Return Type
Recall that executing the `GetUserSkills` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserSkillsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserSkillsData {
  userSkills: ({
    skill: {
      name: string;
    };
  })[];
}
```
### Using `GetUserSkills`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserSkills } from '@dataconnect/generated';


// Call the `getUserSkills()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserSkills();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserSkills(dataConnect);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
getUserSkills().then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

### Using `GetUserSkills`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserSkillsRef } from '@dataconnect/generated';


// Call the `getUserSkillsRef()` function to get a reference to the query.
const ref = getUserSkillsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserSkillsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

## ListUsersWithSkill
You can execute the `ListUsersWithSkill` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsersWithSkill(vars: ListUsersWithSkillVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersWithSkillData, ListUsersWithSkillVariables>;

interface ListUsersWithSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersWithSkillVariables): QueryRef<ListUsersWithSkillData, ListUsersWithSkillVariables>;
}
export const listUsersWithSkillRef: ListUsersWithSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsersWithSkill(dc: DataConnect, vars: ListUsersWithSkillVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersWithSkillData, ListUsersWithSkillVariables>;

interface ListUsersWithSkillRef {
  ...
  (dc: DataConnect, vars: ListUsersWithSkillVariables): QueryRef<ListUsersWithSkillData, ListUsersWithSkillVariables>;
}
export const listUsersWithSkillRef: ListUsersWithSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersWithSkillRef:
```typescript
const name = listUsersWithSkillRef.operationName;
console.log(name);
```

### Variables
The `ListUsersWithSkill` query requires an argument of type `ListUsersWithSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUsersWithSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUsersWithSkill` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersWithSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersWithSkillData {
  userSkills: ({
    user: {
      displayName: string;
    };
  })[];
}
```
### Using `ListUsersWithSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsersWithSkill, ListUsersWithSkillVariables } from '@dataconnect/generated';

// The `ListUsersWithSkill` query requires an argument of type `ListUsersWithSkillVariables`:
const listUsersWithSkillVars: ListUsersWithSkillVariables = {
  skillId: ..., 
};

// Call the `listUsersWithSkill()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsersWithSkill(listUsersWithSkillVars);
// Variables can be defined inline as well.
const { data } = await listUsersWithSkill({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsersWithSkill(dataConnect, listUsersWithSkillVars);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
listUsersWithSkill(listUsersWithSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

### Using `ListUsersWithSkill`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersWithSkillRef, ListUsersWithSkillVariables } from '@dataconnect/generated';

// The `ListUsersWithSkill` query requires an argument of type `ListUsersWithSkillVariables`:
const listUsersWithSkillVars: ListUsersWithSkillVariables = {
  skillId: ..., 
};

// Call the `listUsersWithSkillRef()` function to get a reference to the query.
const ref = listUsersWithSkillRef(listUsersWithSkillVars);
// Variables can be defined inline as well.
const ref = listUsersWithSkillRef({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersWithSkillRef(dataConnect, listUsersWithSkillVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userSkills);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkills);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserBio
You can execute the `UpdateUserBio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserBio(vars: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserBio(dc: DataConnect, vars: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  (dc: DataConnect, vars: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserBioRef:
```typescript
const name = updateUserBioRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserBio` mutation requires an argument of type `UpdateUserBioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserBioVariables {
  bio: string;
}
```
### Return Type
Recall that executing the `UpdateUserBio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserBioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserBioData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserBio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserBio, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation requires an argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., 
};

// Call the `updateUserBio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserBio(updateUserBioVars);
// Variables can be defined inline as well.
const { data } = await updateUserBio({ bio: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserBio(dataConnect, updateUserBioVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserBio(updateUserBioVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserBio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserBioRef, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation requires an argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., 
};

// Call the `updateUserBioRef()` function to get a reference to the mutation.
const ref = updateUserBioRef(updateUserBioVars);
// Variables can be defined inline as well.
const ref = updateUserBioRef({ bio: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserBioRef(dataConnect, updateUserBioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateConsultationRequest
You can execute the `CreateConsultationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createConsultationRequest(vars: CreateConsultationRequestVariables): MutationPromise<CreateConsultationRequestData, CreateConsultationRequestVariables>;

interface CreateConsultationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConsultationRequestVariables): MutationRef<CreateConsultationRequestData, CreateConsultationRequestVariables>;
}
export const createConsultationRequestRef: CreateConsultationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createConsultationRequest(dc: DataConnect, vars: CreateConsultationRequestVariables): MutationPromise<CreateConsultationRequestData, CreateConsultationRequestVariables>;

interface CreateConsultationRequestRef {
  ...
  (dc: DataConnect, vars: CreateConsultationRequestVariables): MutationRef<CreateConsultationRequestData, CreateConsultationRequestVariables>;
}
export const createConsultationRequestRef: CreateConsultationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createConsultationRequestRef:
```typescript
const name = createConsultationRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateConsultationRequest` mutation requires an argument of type `CreateConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateConsultationRequestVariables {
  title: string;
  description: string;
  urgency: string;
}
```
### Return Type
Recall that executing the `CreateConsultationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateConsultationRequestData {
  consultationRequest_insert: ConsultationRequest_Key;
}
```
### Using `CreateConsultationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createConsultationRequest, CreateConsultationRequestVariables } from '@dataconnect/generated';

// The `CreateConsultationRequest` mutation requires an argument of type `CreateConsultationRequestVariables`:
const createConsultationRequestVars: CreateConsultationRequestVariables = {
  title: ..., 
  description: ..., 
  urgency: ..., 
};

// Call the `createConsultationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createConsultationRequest(createConsultationRequestVars);
// Variables can be defined inline as well.
const { data } = await createConsultationRequest({ title: ..., description: ..., urgency: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createConsultationRequest(dataConnect, createConsultationRequestVars);

console.log(data.consultationRequest_insert);

// Or, you can use the `Promise` API.
createConsultationRequest(createConsultationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_insert);
});
```

### Using `CreateConsultationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createConsultationRequestRef, CreateConsultationRequestVariables } from '@dataconnect/generated';

// The `CreateConsultationRequest` mutation requires an argument of type `CreateConsultationRequestVariables`:
const createConsultationRequestVars: CreateConsultationRequestVariables = {
  title: ..., 
  description: ..., 
  urgency: ..., 
};

// Call the `createConsultationRequestRef()` function to get a reference to the mutation.
const ref = createConsultationRequestRef(createConsultationRequestVars);
// Variables can be defined inline as well.
const ref = createConsultationRequestRef({ title: ..., description: ..., urgency: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createConsultationRequestRef(dataConnect, createConsultationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_insert);
});
```

## UpdateRequestStatus
You can execute the `UpdateRequestStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateRequestStatus(vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface UpdateRequestStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRequestStatus(dc: DataConnect, vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface UpdateRequestStatusRef {
  ...
  (dc: DataConnect, vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRequestStatusRef:
```typescript
const name = updateRequestStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateRequestStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRequestStatusData {
  consultationRequest_update?: ConsultationRequest_Key | null;
}
```
### Using `UpdateRequestStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRequestStatus, UpdateRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`:
const updateRequestStatusVars: UpdateRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateRequestStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRequestStatus(updateRequestStatusVars);
// Variables can be defined inline as well.
const { data } = await updateRequestStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRequestStatus(dataConnect, updateRequestStatusVars);

console.log(data.consultationRequest_update);

// Or, you can use the `Promise` API.
updateRequestStatus(updateRequestStatusVars).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_update);
});
```

### Using `UpdateRequestStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRequestStatusRef, UpdateRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`:
const updateRequestStatusVars: UpdateRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateRequestStatusRef()` function to get a reference to the mutation.
const ref = updateRequestStatusRef(updateRequestStatusVars);
// Variables can be defined inline as well.
const ref = updateRequestStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRequestStatusRef(dataConnect, updateRequestStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_update);
});
```

## DeleteConsultationRequest
You can execute the `DeleteConsultationRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteConsultationRequest(vars: DeleteConsultationRequestVariables): MutationPromise<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;

interface DeleteConsultationRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteConsultationRequestVariables): MutationRef<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
}
export const deleteConsultationRequestRef: DeleteConsultationRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteConsultationRequest(dc: DataConnect, vars: DeleteConsultationRequestVariables): MutationPromise<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;

interface DeleteConsultationRequestRef {
  ...
  (dc: DataConnect, vars: DeleteConsultationRequestVariables): MutationRef<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
}
export const deleteConsultationRequestRef: DeleteConsultationRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteConsultationRequestRef:
```typescript
const name = deleteConsultationRequestRef.operationName;
console.log(name);
```

### Variables
The `DeleteConsultationRequest` mutation requires an argument of type `DeleteConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteConsultationRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteConsultationRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteConsultationRequestData {
  consultationRequest_delete?: ConsultationRequest_Key | null;
}
```
### Using `DeleteConsultationRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteConsultationRequest, DeleteConsultationRequestVariables } from '@dataconnect/generated';

// The `DeleteConsultationRequest` mutation requires an argument of type `DeleteConsultationRequestVariables`:
const deleteConsultationRequestVars: DeleteConsultationRequestVariables = {
  id: ..., 
};

// Call the `deleteConsultationRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteConsultationRequest(deleteConsultationRequestVars);
// Variables can be defined inline as well.
const { data } = await deleteConsultationRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteConsultationRequest(dataConnect, deleteConsultationRequestVars);

console.log(data.consultationRequest_delete);

// Or, you can use the `Promise` API.
deleteConsultationRequest(deleteConsultationRequestVars).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_delete);
});
```

### Using `DeleteConsultationRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteConsultationRequestRef, DeleteConsultationRequestVariables } from '@dataconnect/generated';

// The `DeleteConsultationRequest` mutation requires an argument of type `DeleteConsultationRequestVariables`:
const deleteConsultationRequestVars: DeleteConsultationRequestVariables = {
  id: ..., 
};

// Call the `deleteConsultationRequestRef()` function to get a reference to the mutation.
const ref = deleteConsultationRequestRef(deleteConsultationRequestVars);
// Variables can be defined inline as well.
const ref = deleteConsultationRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteConsultationRequestRef(dataConnect, deleteConsultationRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationRequest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationRequest_delete);
});
```

## CreateConsultationSession
You can execute the `CreateConsultationSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createConsultationSession(vars: CreateConsultationSessionVariables): MutationPromise<CreateConsultationSessionData, CreateConsultationSessionVariables>;

interface CreateConsultationSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConsultationSessionVariables): MutationRef<CreateConsultationSessionData, CreateConsultationSessionVariables>;
}
export const createConsultationSessionRef: CreateConsultationSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createConsultationSession(dc: DataConnect, vars: CreateConsultationSessionVariables): MutationPromise<CreateConsultationSessionData, CreateConsultationSessionVariables>;

interface CreateConsultationSessionRef {
  ...
  (dc: DataConnect, vars: CreateConsultationSessionVariables): MutationRef<CreateConsultationSessionData, CreateConsultationSessionVariables>;
}
export const createConsultationSessionRef: CreateConsultationSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createConsultationSessionRef:
```typescript
const name = createConsultationSessionRef.operationName;
console.log(name);
```

### Variables
The `CreateConsultationSession` mutation requires an argument of type `CreateConsultationSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateConsultationSessionVariables {
  reqId: UUIDString;
  mentorId: UUIDString;
  start: TimestampString;
  end: TimestampString;
}
```
### Return Type
Recall that executing the `CreateConsultationSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateConsultationSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateConsultationSessionData {
  consultationSession_insert: ConsultationSession_Key;
}
```
### Using `CreateConsultationSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createConsultationSession, CreateConsultationSessionVariables } from '@dataconnect/generated';

// The `CreateConsultationSession` mutation requires an argument of type `CreateConsultationSessionVariables`:
const createConsultationSessionVars: CreateConsultationSessionVariables = {
  reqId: ..., 
  mentorId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `createConsultationSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createConsultationSession(createConsultationSessionVars);
// Variables can be defined inline as well.
const { data } = await createConsultationSession({ reqId: ..., mentorId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createConsultationSession(dataConnect, createConsultationSessionVars);

console.log(data.consultationSession_insert);

// Or, you can use the `Promise` API.
createConsultationSession(createConsultationSessionVars).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_insert);
});
```

### Using `CreateConsultationSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createConsultationSessionRef, CreateConsultationSessionVariables } from '@dataconnect/generated';

// The `CreateConsultationSession` mutation requires an argument of type `CreateConsultationSessionVariables`:
const createConsultationSessionVars: CreateConsultationSessionVariables = {
  reqId: ..., 
  mentorId: ..., 
  start: ..., 
  end: ..., 
};

// Call the `createConsultationSessionRef()` function to get a reference to the mutation.
const ref = createConsultationSessionRef(createConsultationSessionVars);
// Variables can be defined inline as well.
const ref = createConsultationSessionRef({ reqId: ..., mentorId: ..., start: ..., end: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createConsultationSessionRef(dataConnect, createConsultationSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationSession_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_insert);
});
```

## UpdateSessionNotes
You can execute the `UpdateSessionNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSessionNotes(vars: UpdateSessionNotesVariables): MutationPromise<UpdateSessionNotesData, UpdateSessionNotesVariables>;

interface UpdateSessionNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSessionNotesVariables): MutationRef<UpdateSessionNotesData, UpdateSessionNotesVariables>;
}
export const updateSessionNotesRef: UpdateSessionNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSessionNotes(dc: DataConnect, vars: UpdateSessionNotesVariables): MutationPromise<UpdateSessionNotesData, UpdateSessionNotesVariables>;

interface UpdateSessionNotesRef {
  ...
  (dc: DataConnect, vars: UpdateSessionNotesVariables): MutationRef<UpdateSessionNotesData, UpdateSessionNotesVariables>;
}
export const updateSessionNotesRef: UpdateSessionNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSessionNotesRef:
```typescript
const name = updateSessionNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateSessionNotes` mutation requires an argument of type `UpdateSessionNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSessionNotesVariables {
  id: UUIDString;
  notes: string;
}
```
### Return Type
Recall that executing the `UpdateSessionNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSessionNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSessionNotesData {
  consultationSession_update?: ConsultationSession_Key | null;
}
```
### Using `UpdateSessionNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSessionNotes, UpdateSessionNotesVariables } from '@dataconnect/generated';

// The `UpdateSessionNotes` mutation requires an argument of type `UpdateSessionNotesVariables`:
const updateSessionNotesVars: UpdateSessionNotesVariables = {
  id: ..., 
  notes: ..., 
};

// Call the `updateSessionNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSessionNotes(updateSessionNotesVars);
// Variables can be defined inline as well.
const { data } = await updateSessionNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSessionNotes(dataConnect, updateSessionNotesVars);

console.log(data.consultationSession_update);

// Or, you can use the `Promise` API.
updateSessionNotes(updateSessionNotesVars).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_update);
});
```

### Using `UpdateSessionNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSessionNotesRef, UpdateSessionNotesVariables } from '@dataconnect/generated';

// The `UpdateSessionNotes` mutation requires an argument of type `UpdateSessionNotesVariables`:
const updateSessionNotesVars: UpdateSessionNotesVariables = {
  id: ..., 
  notes: ..., 
};

// Call the `updateSessionNotesRef()` function to get a reference to the mutation.
const ref = updateSessionNotesRef(updateSessionNotesVars);
// Variables can be defined inline as well.
const ref = updateSessionNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSessionNotesRef(dataConnect, updateSessionNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationSession_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_update);
});
```

## DeleteConsultationSession
You can execute the `DeleteConsultationSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteConsultationSession(vars: DeleteConsultationSessionVariables): MutationPromise<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;

interface DeleteConsultationSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteConsultationSessionVariables): MutationRef<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
}
export const deleteConsultationSessionRef: DeleteConsultationSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteConsultationSession(dc: DataConnect, vars: DeleteConsultationSessionVariables): MutationPromise<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;

interface DeleteConsultationSessionRef {
  ...
  (dc: DataConnect, vars: DeleteConsultationSessionVariables): MutationRef<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
}
export const deleteConsultationSessionRef: DeleteConsultationSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteConsultationSessionRef:
```typescript
const name = deleteConsultationSessionRef.operationName;
console.log(name);
```

### Variables
The `DeleteConsultationSession` mutation requires an argument of type `DeleteConsultationSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteConsultationSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteConsultationSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteConsultationSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteConsultationSessionData {
  consultationSession_delete?: ConsultationSession_Key | null;
}
```
### Using `DeleteConsultationSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteConsultationSession, DeleteConsultationSessionVariables } from '@dataconnect/generated';

// The `DeleteConsultationSession` mutation requires an argument of type `DeleteConsultationSessionVariables`:
const deleteConsultationSessionVars: DeleteConsultationSessionVariables = {
  id: ..., 
};

// Call the `deleteConsultationSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteConsultationSession(deleteConsultationSessionVars);
// Variables can be defined inline as well.
const { data } = await deleteConsultationSession({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteConsultationSession(dataConnect, deleteConsultationSessionVars);

console.log(data.consultationSession_delete);

// Or, you can use the `Promise` API.
deleteConsultationSession(deleteConsultationSessionVars).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_delete);
});
```

### Using `DeleteConsultationSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteConsultationSessionRef, DeleteConsultationSessionVariables } from '@dataconnect/generated';

// The `DeleteConsultationSession` mutation requires an argument of type `DeleteConsultationSessionVariables`:
const deleteConsultationSessionVars: DeleteConsultationSessionVariables = {
  id: ..., 
};

// Call the `deleteConsultationSessionRef()` function to get a reference to the mutation.
const ref = deleteConsultationSessionRef(deleteConsultationSessionVars);
// Variables can be defined inline as well.
const ref = deleteConsultationSessionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteConsultationSessionRef(dataConnect, deleteConsultationSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.consultationSession_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.consultationSession_delete);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  sessionId: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  sessionId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ sessionId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  sessionId: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ sessionId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## UpdateReview
You can execute the `UpdateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReviewRef:
```typescript
const name = updateReviewRef.operationName;
console.log(name);
```

### Variables
The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReviewVariables {
  id: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that executing the `UpdateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReviewData {
  review_update?: Review_Key | null;
}
```
### Using `UpdateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReview, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `updateReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReview(updateReviewVars);
// Variables can be defined inline as well.
const { data } = await updateReview({ id: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReview(dataConnect, updateReviewVars);

console.log(data.review_update);

// Or, you can use the `Promise` API.
updateReview(updateReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

### Using `UpdateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReviewRef, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  rating: ..., 
  comment: ..., 
};

// Call the `updateReviewRef()` function to get a reference to the mutation.
const ref = updateReviewRef(updateReviewVars);
// Variables can be defined inline as well.
const ref = updateReviewRef({ id: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReviewRef(dataConnect, updateReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

## DeleteReview
You can execute the `DeleteReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewRef:
```typescript
const name = deleteReviewRef.operationName;
console.log(name);
```

### Variables
The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}
```
### Using `DeleteReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReview, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReview(deleteReviewVars);
// Variables can be defined inline as well.
const { data } = await deleteReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReview(dataConnect, deleteReviewVars);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
deleteReview(deleteReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

### Using `DeleteReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewRef, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReviewRef()` function to get a reference to the mutation.
const ref = deleteReviewRef(deleteReviewVars);
// Variables can be defined inline as well.
const ref = deleteReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewRef(dataConnect, deleteReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

## CreateSkill
You can execute the `CreateSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface CreateSkillRef {
  ...
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
}
export const createSkillRef: CreateSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSkillRef:
```typescript
const name = createSkillRef.operationName;
console.log(name);
```

### Variables
The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSkillVariables {
  name: string;
  category: string;
}
```
### Return Type
Recall that executing the `CreateSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSkillData {
  skill_insert: Skill_Key;
}
```
### Using `CreateSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSkill, CreateSkillVariables } from '@dataconnect/generated';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., 
};

// Call the `createSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSkill(createSkillVars);
// Variables can be defined inline as well.
const { data } = await createSkill({ name: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSkill(dataConnect, createSkillVars);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
createSkill(createSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

### Using `CreateSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSkillRef, CreateSkillVariables } from '@dataconnect/generated';

// The `CreateSkill` mutation requires an argument of type `CreateSkillVariables`:
const createSkillVars: CreateSkillVariables = {
  name: ..., 
  category: ..., 
};

// Call the `createSkillRef()` function to get a reference to the mutation.
const ref = createSkillRef(createSkillVars);
// Variables can be defined inline as well.
const ref = createSkillRef({ name: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSkillRef(dataConnect, createSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_insert);
});
```

## UpdateSkill
You can execute the `UpdateSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateSkill(vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface UpdateSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
}
export const updateSkillRef: UpdateSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateSkill(dc: DataConnect, vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface UpdateSkillRef {
  ...
  (dc: DataConnect, vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
}
export const updateSkillRef: UpdateSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateSkillRef:
```typescript
const name = updateSkillRef.operationName;
console.log(name);
```

### Variables
The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateSkillVariables {
  id: UUIDString;
  name: string;
}
```
### Return Type
Recall that executing the `UpdateSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateSkillData {
  skill_update?: Skill_Key | null;
}
```
### Using `UpdateSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateSkill, UpdateSkillVariables } from '@dataconnect/generated';

// The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`:
const updateSkillVars: UpdateSkillVariables = {
  id: ..., 
  name: ..., 
};

// Call the `updateSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateSkill(updateSkillVars);
// Variables can be defined inline as well.
const { data } = await updateSkill({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateSkill(dataConnect, updateSkillVars);

console.log(data.skill_update);

// Or, you can use the `Promise` API.
updateSkill(updateSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_update);
});
```

### Using `UpdateSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateSkillRef, UpdateSkillVariables } from '@dataconnect/generated';

// The `UpdateSkill` mutation requires an argument of type `UpdateSkillVariables`:
const updateSkillVars: UpdateSkillVariables = {
  id: ..., 
  name: ..., 
};

// Call the `updateSkillRef()` function to get a reference to the mutation.
const ref = updateSkillRef(updateSkillVars);
// Variables can be defined inline as well.
const ref = updateSkillRef({ id: ..., name: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateSkillRef(dataConnect, updateSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_update);
});
```

## DeleteSkill
You can execute the `DeleteSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteSkill(vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface DeleteSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
}
export const deleteSkillRef: DeleteSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteSkill(dc: DataConnect, vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface DeleteSkillRef {
  ...
  (dc: DataConnect, vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
}
export const deleteSkillRef: DeleteSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteSkillRef:
```typescript
const name = deleteSkillRef.operationName;
console.log(name);
```

### Variables
The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteSkillData {
  skill_delete?: Skill_Key | null;
}
```
### Using `DeleteSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteSkill, DeleteSkillVariables } from '@dataconnect/generated';

// The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`:
const deleteSkillVars: DeleteSkillVariables = {
  id: ..., 
};

// Call the `deleteSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteSkill(deleteSkillVars);
// Variables can be defined inline as well.
const { data } = await deleteSkill({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteSkill(dataConnect, deleteSkillVars);

console.log(data.skill_delete);

// Or, you can use the `Promise` API.
deleteSkill(deleteSkillVars).then((response) => {
  const data = response.data;
  console.log(data.skill_delete);
});
```

### Using `DeleteSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteSkillRef, DeleteSkillVariables } from '@dataconnect/generated';

// The `DeleteSkill` mutation requires an argument of type `DeleteSkillVariables`:
const deleteSkillVars: DeleteSkillVariables = {
  id: ..., 
};

// Call the `deleteSkillRef()` function to get a reference to the mutation.
const ref = deleteSkillRef(deleteSkillVars);
// Variables can be defined inline as well.
const ref = deleteSkillRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteSkillRef(dataConnect, deleteSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.skill_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.skill_delete);
});
```

## AddUserSkill
You can execute the `AddUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addUserSkill(vars: AddUserSkillVariables): MutationPromise<AddUserSkillData, AddUserSkillVariables>;

interface AddUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserSkillVariables): MutationRef<AddUserSkillData, AddUserSkillVariables>;
}
export const addUserSkillRef: AddUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addUserSkill(dc: DataConnect, vars: AddUserSkillVariables): MutationPromise<AddUserSkillData, AddUserSkillVariables>;

interface AddUserSkillRef {
  ...
  (dc: DataConnect, vars: AddUserSkillVariables): MutationRef<AddUserSkillData, AddUserSkillVariables>;
}
export const addUserSkillRef: AddUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addUserSkillRef:
```typescript
const name = addUserSkillRef.operationName;
console.log(name);
```

### Variables
The `AddUserSkill` mutation requires an argument of type `AddUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddUserSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that executing the `AddUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddUserSkillData {
  userSkill_insert: UserSkill_Key;
}
```
### Using `AddUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addUserSkill, AddUserSkillVariables } from '@dataconnect/generated';

// The `AddUserSkill` mutation requires an argument of type `AddUserSkillVariables`:
const addUserSkillVars: AddUserSkillVariables = {
  skillId: ..., 
};

// Call the `addUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addUserSkill(addUserSkillVars);
// Variables can be defined inline as well.
const { data } = await addUserSkill({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addUserSkill(dataConnect, addUserSkillVars);

console.log(data.userSkill_insert);

// Or, you can use the `Promise` API.
addUserSkill(addUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_insert);
});
```

### Using `AddUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addUserSkillRef, AddUserSkillVariables } from '@dataconnect/generated';

// The `AddUserSkill` mutation requires an argument of type `AddUserSkillVariables`:
const addUserSkillVars: AddUserSkillVariables = {
  skillId: ..., 
};

// Call the `addUserSkillRef()` function to get a reference to the mutation.
const ref = addUserSkillRef(addUserSkillVars);
// Variables can be defined inline as well.
const ref = addUserSkillRef({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addUserSkillRef(dataConnect, addUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_insert);
});
```

## RemoveUserSkill
You can execute the `RemoveUserSkill` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
removeUserSkill(vars: RemoveUserSkillVariables): MutationPromise<RemoveUserSkillData, RemoveUserSkillVariables>;

interface RemoveUserSkillRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveUserSkillVariables): MutationRef<RemoveUserSkillData, RemoveUserSkillVariables>;
}
export const removeUserSkillRef: RemoveUserSkillRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeUserSkill(dc: DataConnect, vars: RemoveUserSkillVariables): MutationPromise<RemoveUserSkillData, RemoveUserSkillVariables>;

interface RemoveUserSkillRef {
  ...
  (dc: DataConnect, vars: RemoveUserSkillVariables): MutationRef<RemoveUserSkillData, RemoveUserSkillVariables>;
}
export const removeUserSkillRef: RemoveUserSkillRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeUserSkillRef:
```typescript
const name = removeUserSkillRef.operationName;
console.log(name);
```

### Variables
The `RemoveUserSkill` mutation requires an argument of type `RemoveUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveUserSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveUserSkill` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveUserSkillData {
  userSkill_delete?: UserSkill_Key | null;
}
```
### Using `RemoveUserSkill`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeUserSkill, RemoveUserSkillVariables } from '@dataconnect/generated';

// The `RemoveUserSkill` mutation requires an argument of type `RemoveUserSkillVariables`:
const removeUserSkillVars: RemoveUserSkillVariables = {
  skillId: ..., 
};

// Call the `removeUserSkill()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeUserSkill(removeUserSkillVars);
// Variables can be defined inline as well.
const { data } = await removeUserSkill({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeUserSkill(dataConnect, removeUserSkillVars);

console.log(data.userSkill_delete);

// Or, you can use the `Promise` API.
removeUserSkill(removeUserSkillVars).then((response) => {
  const data = response.data;
  console.log(data.userSkill_delete);
});
```

### Using `RemoveUserSkill`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeUserSkillRef, RemoveUserSkillVariables } from '@dataconnect/generated';

// The `RemoveUserSkill` mutation requires an argument of type `RemoveUserSkillVariables`:
const removeUserSkillVars: RemoveUserSkillVariables = {
  skillId: ..., 
};

// Call the `removeUserSkillRef()` function to get a reference to the mutation.
const ref = removeUserSkillRef(removeUserSkillVars);
// Variables can be defined inline as well.
const ref = removeUserSkillRef({ skillId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeUserSkillRef(dataConnect, removeUserSkillVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userSkill_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userSkill_delete);
});
```

