# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetMyUser
You can execute the `GetMyUser` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyUser(options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;
```

### Variables
The `GetMyUser` Query has no variables.
### Return Type
Recall that calling the `GetMyUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyUser` Query is of type `GetMyUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMyUserData {
  user?: {
    displayName: string;
    email: string;
    bio?: string | null;
  };
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetMyUser } from '@dataconnect/generated/react'

export default function GetMyUserComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyUser();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyUser(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyUser(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListAllUsers
You can execute the `ListAllUsers` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
```

### Variables
The `ListAllUsers` Query has no variables.
### Return Type
Recall that calling the `ListAllUsers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListAllUsers` Query is of type `ListAllUsersData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListAllUsersData {
  users: ({
    displayName: string;
    role: string;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListAllUsers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListAllUsers } from '@dataconnect/generated/react'

export default function ListAllUsersComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAllUsers();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAllUsers(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAllUsers(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAllUsers(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetConsultationRequest
You can execute the `GetConsultationRequest` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetConsultationRequest(dc: DataConnect, vars: GetConsultationRequestVariables, options?: useDataConnectQueryOptions<GetConsultationRequestData>): UseDataConnectQueryResult<GetConsultationRequestData, GetConsultationRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetConsultationRequest(vars: GetConsultationRequestVariables, options?: useDataConnectQueryOptions<GetConsultationRequestData>): UseDataConnectQueryResult<GetConsultationRequestData, GetConsultationRequestVariables>;
```

### Variables
The `GetConsultationRequest` Query requires an argument of type `GetConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetConsultationRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetConsultationRequest` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetConsultationRequest` Query is of type `GetConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetConsultationRequest`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetConsultationRequestVariables } from '@dataconnect/generated';
import { useGetConsultationRequest } from '@dataconnect/generated/react'

export default function GetConsultationRequestComponent() {
  // The `useGetConsultationRequest` Query hook requires an argument of type `GetConsultationRequestVariables`:
  const getConsultationRequestVars: GetConsultationRequestVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetConsultationRequest(getConsultationRequestVars);
  // Variables can be defined inline as well.
  const query = useGetConsultationRequest({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetConsultationRequest(dataConnect, getConsultationRequestVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetConsultationRequest(getConsultationRequestVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetConsultationRequest(dataConnect, getConsultationRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.consultationRequest);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyConsultationRequests
You can execute the `ListMyConsultationRequests` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyConsultationRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyConsultationRequestsData>): UseDataConnectQueryResult<ListMyConsultationRequestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyConsultationRequests(options?: useDataConnectQueryOptions<ListMyConsultationRequestsData>): UseDataConnectQueryResult<ListMyConsultationRequestsData, undefined>;
```

### Variables
The `ListMyConsultationRequests` Query has no variables.
### Return Type
Recall that calling the `ListMyConsultationRequests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyConsultationRequests` Query is of type `ListMyConsultationRequestsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListMyConsultationRequestsData {
  consultationRequests: ({
    title: string;
    status: string;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyConsultationRequests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListMyConsultationRequests } from '@dataconnect/generated/react'

export default function ListMyConsultationRequestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyConsultationRequests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyConsultationRequests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyConsultationRequests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyConsultationRequests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.consultationRequests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetSession
You can execute the `GetSession` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetSession(dc: DataConnect, vars: GetSessionVariables, options?: useDataConnectQueryOptions<GetSessionData>): UseDataConnectQueryResult<GetSessionData, GetSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetSession(vars: GetSessionVariables, options?: useDataConnectQueryOptions<GetSessionData>): UseDataConnectQueryResult<GetSessionData, GetSessionVariables>;
```

### Variables
The `GetSession` Query requires an argument of type `GetSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetSession` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetSession` Query is of type `GetSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetSession`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetSessionVariables } from '@dataconnect/generated';
import { useGetSession } from '@dataconnect/generated/react'

export default function GetSessionComponent() {
  // The `useGetSession` Query hook requires an argument of type `GetSessionVariables`:
  const getSessionVars: GetSessionVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetSession(getSessionVars);
  // Variables can be defined inline as well.
  const query = useGetSession({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetSession(dataConnect, getSessionVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetSession(getSessionVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetSession(dataConnect, getSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.consultationSession);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUpcomingSessions
You can execute the `ListUpcomingSessions` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUpcomingSessions(dc: DataConnect, options?: useDataConnectQueryOptions<ListUpcomingSessionsData>): UseDataConnectQueryResult<ListUpcomingSessionsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUpcomingSessions(options?: useDataConnectQueryOptions<ListUpcomingSessionsData>): UseDataConnectQueryResult<ListUpcomingSessionsData, undefined>;
```

### Variables
The `ListUpcomingSessions` Query has no variables.
### Return Type
Recall that calling the `ListUpcomingSessions` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUpcomingSessions` Query is of type `ListUpcomingSessionsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUpcomingSessionsData {
  consultationSessions: ({
    startDate: TimestampString;
    status: string;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUpcomingSessions`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListUpcomingSessions } from '@dataconnect/generated/react'

export default function ListUpcomingSessionsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUpcomingSessions();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUpcomingSessions(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUpcomingSessions(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUpcomingSessions(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.consultationSessions);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetReview
You can execute the `GetReview` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetReview(dc: DataConnect, vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetReview(vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;
```

### Variables
The `GetReview` Query requires an argument of type `GetReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetReview` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetReview` Query is of type `GetReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetReview`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetReviewVariables } from '@dataconnect/generated';
import { useGetReview } from '@dataconnect/generated/react'

export default function GetReviewComponent() {
  // The `useGetReview` Query hook requires an argument of type `GetReviewVariables`:
  const getReviewVars: GetReviewVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetReview(getReviewVars);
  // Variables can be defined inline as well.
  const query = useGetReview({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetReview(dataConnect, getReviewVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetReview(getReviewVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetReview(dataConnect, getReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.review);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListReviewsForSession
You can execute the `ListReviewsForSession` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListReviewsForSession(dc: DataConnect, vars: ListReviewsForSessionVariables, options?: useDataConnectQueryOptions<ListReviewsForSessionData>): UseDataConnectQueryResult<ListReviewsForSessionData, ListReviewsForSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListReviewsForSession(vars: ListReviewsForSessionVariables, options?: useDataConnectQueryOptions<ListReviewsForSessionData>): UseDataConnectQueryResult<ListReviewsForSessionData, ListReviewsForSessionVariables>;
```

### Variables
The `ListReviewsForSession` Query requires an argument of type `ListReviewsForSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListReviewsForSessionVariables {
  sessionId: UUIDString;
}
```
### Return Type
Recall that calling the `ListReviewsForSession` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListReviewsForSession` Query is of type `ListReviewsForSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListReviewsForSessionData {
  reviews: ({
    rating: number;
    comment: string;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListReviewsForSession`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListReviewsForSessionVariables } from '@dataconnect/generated';
import { useListReviewsForSession } from '@dataconnect/generated/react'

export default function ListReviewsForSessionComponent() {
  // The `useListReviewsForSession` Query hook requires an argument of type `ListReviewsForSessionVariables`:
  const listReviewsForSessionVars: ListReviewsForSessionVariables = {
    sessionId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListReviewsForSession(listReviewsForSessionVars);
  // Variables can be defined inline as well.
  const query = useListReviewsForSession({ sessionId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListReviewsForSession(dataConnect, listReviewsForSessionVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListReviewsForSession(listReviewsForSessionVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListReviewsForSession(dataConnect, listReviewsForSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetSkill
You can execute the `GetSkill` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetSkill(dc: DataConnect, vars: GetSkillVariables, options?: useDataConnectQueryOptions<GetSkillData>): UseDataConnectQueryResult<GetSkillData, GetSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetSkill(vars: GetSkillVariables, options?: useDataConnectQueryOptions<GetSkillData>): UseDataConnectQueryResult<GetSkillData, GetSkillVariables>;
```

### Variables
The `GetSkill` Query requires an argument of type `GetSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetSkill` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetSkill` Query is of type `GetSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetSkillData {
  skill?: {
    name: string;
    category?: string | null;
  };
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetSkill`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetSkillVariables } from '@dataconnect/generated';
import { useGetSkill } from '@dataconnect/generated/react'

export default function GetSkillComponent() {
  // The `useGetSkill` Query hook requires an argument of type `GetSkillVariables`:
  const getSkillVars: GetSkillVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetSkill(getSkillVars);
  // Variables can be defined inline as well.
  const query = useGetSkill({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetSkill(dataConnect, getSkillVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetSkill(getSkillVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetSkill(dataConnect, getSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.skill);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListAllSkills
You can execute the `ListAllSkills` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAllSkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllSkillsData>): UseDataConnectQueryResult<ListAllSkillsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAllSkills(options?: useDataConnectQueryOptions<ListAllSkillsData>): UseDataConnectQueryResult<ListAllSkillsData, undefined>;
```

### Variables
The `ListAllSkills` Query has no variables.
### Return Type
Recall that calling the `ListAllSkills` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListAllSkills` Query is of type `ListAllSkillsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListAllSkillsData {
  skills: ({
    name: string;
    category?: string | null;
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListAllSkills`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListAllSkills } from '@dataconnect/generated/react'

export default function ListAllSkillsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAllSkills();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAllSkills(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAllSkills(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAllSkills(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.skills);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUserSkills
You can execute the `GetUserSkills` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUserSkills(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserSkillsData>): UseDataConnectQueryResult<GetUserSkillsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserSkills(options?: useDataConnectQueryOptions<GetUserSkillsData>): UseDataConnectQueryResult<GetUserSkillsData, undefined>;
```

### Variables
The `GetUserSkills` Query has no variables.
### Return Type
Recall that calling the `GetUserSkills` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUserSkills` Query is of type `GetUserSkillsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUserSkillsData {
  userSkills: ({
    skill: {
      name: string;
    };
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUserSkills`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetUserSkills } from '@dataconnect/generated/react'

export default function GetUserSkillsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserSkills();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserSkills(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserSkills(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserSkills(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userSkills);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUsersWithSkill
You can execute the `ListUsersWithSkill` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUsersWithSkill(dc: DataConnect, vars: ListUsersWithSkillVariables, options?: useDataConnectQueryOptions<ListUsersWithSkillData>): UseDataConnectQueryResult<ListUsersWithSkillData, ListUsersWithSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUsersWithSkill(vars: ListUsersWithSkillVariables, options?: useDataConnectQueryOptions<ListUsersWithSkillData>): UseDataConnectQueryResult<ListUsersWithSkillData, ListUsersWithSkillVariables>;
```

### Variables
The `ListUsersWithSkill` Query requires an argument of type `ListUsersWithSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUsersWithSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that calling the `ListUsersWithSkill` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUsersWithSkill` Query is of type `ListUsersWithSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUsersWithSkillData {
  userSkills: ({
    user: {
      displayName: string;
    };
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUsersWithSkill`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUsersWithSkillVariables } from '@dataconnect/generated';
import { useListUsersWithSkill } from '@dataconnect/generated/react'

export default function ListUsersWithSkillComponent() {
  // The `useListUsersWithSkill` Query hook requires an argument of type `ListUsersWithSkillVariables`:
  const listUsersWithSkillVars: ListUsersWithSkillVariables = {
    skillId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUsersWithSkill(listUsersWithSkillVars);
  // Variables can be defined inline as well.
  const query = useListUsersWithSkill({ skillId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUsersWithSkill(dataConnect, listUsersWithSkillVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUsersWithSkill(listUsersWithSkillVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUsersWithSkill(dataConnect, listUsersWithSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userSkills);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateUser
You can execute the `CreateUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
```

### Variables
The `CreateUser` Mutation has no variables.
### Return Type
Recall that calling the `CreateUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUser` Mutation is of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserData {
  user_insert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useCreateUser } from '@dataconnect/generated/react'

export default function CreateUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  mutation.mutate();

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  // Since this Mutation accepts no variables, you must pass `undefined` where you would normally pass the variables.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(undefined, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateUserBio
You can execute the `UpdateUserBio` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateUserBio(options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateUserBio(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;
```

### Variables
The `UpdateUserBio` Mutation requires an argument of type `UpdateUserBioVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateUserBioVariables {
  bio: string;
}
```
### Return Type
Recall that calling the `UpdateUserBio` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateUserBio` Mutation is of type `UpdateUserBioData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateUserBioData {
  user_update?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateUserBio`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateUserBioVariables } from '@dataconnect/generated';
import { useUpdateUserBio } from '@dataconnect/generated/react'

export default function UpdateUserBioComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateUserBio();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateUserBio(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserBio(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserBio(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateUserBio` Mutation requires an argument of type `UpdateUserBioVariables`:
  const updateUserBioVars: UpdateUserBioVariables = {
    bio: ..., 
  };
  mutation.mutate(updateUserBioVars);
  // Variables can be defined inline as well.
  mutation.mutate({ bio: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateUserBioVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUser
You can execute the `DeleteUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
```

### Variables
The `DeleteUser` Mutation has no variables.
### Return Type
Recall that calling the `DeleteUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUser` Mutation is of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useDeleteUser } from '@dataconnect/generated/react'

export default function DeleteUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  mutation.mutate();

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  // Since this Mutation accepts no variables, you must pass `undefined` where you would normally pass the variables.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(undefined, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateConsultationRequest
You can execute the `CreateConsultationRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateConsultationRequest(options?: useDataConnectMutationOptions<CreateConsultationRequestData, FirebaseError, CreateConsultationRequestVariables>): UseDataConnectMutationResult<CreateConsultationRequestData, CreateConsultationRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateConsultationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConsultationRequestData, FirebaseError, CreateConsultationRequestVariables>): UseDataConnectMutationResult<CreateConsultationRequestData, CreateConsultationRequestVariables>;
```

### Variables
The `CreateConsultationRequest` Mutation requires an argument of type `CreateConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateConsultationRequestVariables {
  title: string;
  description: string;
  urgency: string;
}
```
### Return Type
Recall that calling the `CreateConsultationRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateConsultationRequest` Mutation is of type `CreateConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateConsultationRequestData {
  consultationRequest_insert: ConsultationRequest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateConsultationRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateConsultationRequestVariables } from '@dataconnect/generated';
import { useCreateConsultationRequest } from '@dataconnect/generated/react'

export default function CreateConsultationRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateConsultationRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateConsultationRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateConsultationRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateConsultationRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateConsultationRequest` Mutation requires an argument of type `CreateConsultationRequestVariables`:
  const createConsultationRequestVars: CreateConsultationRequestVariables = {
    title: ..., 
    description: ..., 
    urgency: ..., 
  };
  mutation.mutate(createConsultationRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., description: ..., urgency: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createConsultationRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationRequest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateRequestStatus
You can execute the `UpdateRequestStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateRequestStatus(options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
```

### Variables
The `UpdateRequestStatus` Mutation requires an argument of type `UpdateRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `UpdateRequestStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateRequestStatus` Mutation is of type `UpdateRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateRequestStatusData {
  consultationRequest_update?: ConsultationRequest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateRequestStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateRequestStatusVariables } from '@dataconnect/generated';
import { useUpdateRequestStatus } from '@dataconnect/generated/react'

export default function UpdateRequestStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateRequestStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateRequestStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRequestStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRequestStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateRequestStatus` Mutation requires an argument of type `UpdateRequestStatusVariables`:
  const updateRequestStatusVars: UpdateRequestStatusVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateRequestStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateRequestStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationRequest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteConsultationRequest
You can execute the `DeleteConsultationRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteConsultationRequest(options?: useDataConnectMutationOptions<DeleteConsultationRequestData, FirebaseError, DeleteConsultationRequestVariables>): UseDataConnectMutationResult<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteConsultationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteConsultationRequestData, FirebaseError, DeleteConsultationRequestVariables>): UseDataConnectMutationResult<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
```

### Variables
The `DeleteConsultationRequest` Mutation requires an argument of type `DeleteConsultationRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteConsultationRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteConsultationRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteConsultationRequest` Mutation is of type `DeleteConsultationRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteConsultationRequestData {
  consultationRequest_delete?: ConsultationRequest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteConsultationRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteConsultationRequestVariables } from '@dataconnect/generated';
import { useDeleteConsultationRequest } from '@dataconnect/generated/react'

export default function DeleteConsultationRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteConsultationRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteConsultationRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteConsultationRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteConsultationRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteConsultationRequest` Mutation requires an argument of type `DeleteConsultationRequestVariables`:
  const deleteConsultationRequestVars: DeleteConsultationRequestVariables = {
    id: ..., 
  };
  mutation.mutate(deleteConsultationRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteConsultationRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationRequest_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateConsultationSession
You can execute the `CreateConsultationSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateConsultationSession(options?: useDataConnectMutationOptions<CreateConsultationSessionData, FirebaseError, CreateConsultationSessionVariables>): UseDataConnectMutationResult<CreateConsultationSessionData, CreateConsultationSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateConsultationSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConsultationSessionData, FirebaseError, CreateConsultationSessionVariables>): UseDataConnectMutationResult<CreateConsultationSessionData, CreateConsultationSessionVariables>;
```

### Variables
The `CreateConsultationSession` Mutation requires an argument of type `CreateConsultationSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateConsultationSessionVariables {
  reqId: UUIDString;
  mentorId: UUIDString;
  start: TimestampString;
  end: TimestampString;
}
```
### Return Type
Recall that calling the `CreateConsultationSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateConsultationSession` Mutation is of type `CreateConsultationSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateConsultationSessionData {
  consultationSession_insert: ConsultationSession_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateConsultationSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateConsultationSessionVariables } from '@dataconnect/generated';
import { useCreateConsultationSession } from '@dataconnect/generated/react'

export default function CreateConsultationSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateConsultationSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateConsultationSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateConsultationSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateConsultationSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateConsultationSession` Mutation requires an argument of type `CreateConsultationSessionVariables`:
  const createConsultationSessionVars: CreateConsultationSessionVariables = {
    reqId: ..., 
    mentorId: ..., 
    start: ..., 
    end: ..., 
  };
  mutation.mutate(createConsultationSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ reqId: ..., mentorId: ..., start: ..., end: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createConsultationSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationSession_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateSessionNotes
You can execute the `UpdateSessionNotes` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateSessionNotes(options?: useDataConnectMutationOptions<UpdateSessionNotesData, FirebaseError, UpdateSessionNotesVariables>): UseDataConnectMutationResult<UpdateSessionNotesData, UpdateSessionNotesVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateSessionNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSessionNotesData, FirebaseError, UpdateSessionNotesVariables>): UseDataConnectMutationResult<UpdateSessionNotesData, UpdateSessionNotesVariables>;
```

### Variables
The `UpdateSessionNotes` Mutation requires an argument of type `UpdateSessionNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateSessionNotesVariables {
  id: UUIDString;
  notes: string;
}
```
### Return Type
Recall that calling the `UpdateSessionNotes` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateSessionNotes` Mutation is of type `UpdateSessionNotesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateSessionNotesData {
  consultationSession_update?: ConsultationSession_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateSessionNotes`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateSessionNotesVariables } from '@dataconnect/generated';
import { useUpdateSessionNotes } from '@dataconnect/generated/react'

export default function UpdateSessionNotesComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateSessionNotes();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateSessionNotes(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSessionNotes(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSessionNotes(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateSessionNotes` Mutation requires an argument of type `UpdateSessionNotesVariables`:
  const updateSessionNotesVars: UpdateSessionNotesVariables = {
    id: ..., 
    notes: ..., 
  };
  mutation.mutate(updateSessionNotesVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., notes: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateSessionNotesVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationSession_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteConsultationSession
You can execute the `DeleteConsultationSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteConsultationSession(options?: useDataConnectMutationOptions<DeleteConsultationSessionData, FirebaseError, DeleteConsultationSessionVariables>): UseDataConnectMutationResult<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteConsultationSession(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteConsultationSessionData, FirebaseError, DeleteConsultationSessionVariables>): UseDataConnectMutationResult<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
```

### Variables
The `DeleteConsultationSession` Mutation requires an argument of type `DeleteConsultationSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteConsultationSessionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteConsultationSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteConsultationSession` Mutation is of type `DeleteConsultationSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteConsultationSessionData {
  consultationSession_delete?: ConsultationSession_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteConsultationSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteConsultationSessionVariables } from '@dataconnect/generated';
import { useDeleteConsultationSession } from '@dataconnect/generated/react'

export default function DeleteConsultationSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteConsultationSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteConsultationSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteConsultationSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteConsultationSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteConsultationSession` Mutation requires an argument of type `DeleteConsultationSessionVariables`:
  const deleteConsultationSessionVars: DeleteConsultationSessionVariables = {
    id: ..., 
  };
  mutation.mutate(deleteConsultationSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteConsultationSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.consultationSession_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateReview
You can execute the `CreateReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
```

### Variables
The `CreateReview` Mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateReviewVariables {
  sessionId: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that calling the `CreateReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateReview` Mutation is of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateReviewVariables } from '@dataconnect/generated';
import { useCreateReview } from '@dataconnect/generated/react'

export default function CreateReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateReview` Mutation requires an argument of type `CreateReviewVariables`:
  const createReviewVars: CreateReviewVariables = {
    sessionId: ..., 
    rating: ..., 
    comment: ..., 
  };
  mutation.mutate(createReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ sessionId: ..., rating: ..., comment: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.review_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateReview
You can execute the `UpdateReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateReview(options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateReview(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;
```

### Variables
The `UpdateReview` Mutation requires an argument of type `UpdateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateReviewVariables {
  id: UUIDString;
  rating: number;
  comment: string;
}
```
### Return Type
Recall that calling the `UpdateReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateReview` Mutation is of type `UpdateReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateReviewData {
  review_update?: Review_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateReviewVariables } from '@dataconnect/generated';
import { useUpdateReview } from '@dataconnect/generated/react'

export default function UpdateReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateReview` Mutation requires an argument of type `UpdateReviewVariables`:
  const updateReviewVars: UpdateReviewVariables = {
    id: ..., 
    rating: ..., 
    comment: ..., 
  };
  mutation.mutate(updateReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., rating: ..., comment: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.review_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteReview
You can execute the `DeleteReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteReview(options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
```

### Variables
The `DeleteReview` Mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteReview` Mutation is of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteReviewVariables } from '@dataconnect/generated';
import { useDeleteReview } from '@dataconnect/generated/react'

export default function DeleteReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteReview` Mutation requires an argument of type `DeleteReviewVariables`:
  const deleteReviewVars: DeleteReviewVariables = {
    id: ..., 
  };
  mutation.mutate(deleteReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.review_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateSkill
You can execute the `CreateSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSkill(options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
```

### Variables
The `CreateSkill` Mutation requires an argument of type `CreateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateSkillVariables {
  name: string;
  category: string;
}
```
### Return Type
Recall that calling the `CreateSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateSkill` Mutation is of type `CreateSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSkillData {
  skill_insert: Skill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSkillVariables } from '@dataconnect/generated';
import { useCreateSkill } from '@dataconnect/generated/react'

export default function CreateSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSkill` Mutation requires an argument of type `CreateSkillVariables`:
  const createSkillVars: CreateSkillVariables = {
    name: ..., 
    category: ..., 
  };
  mutation.mutate(createSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., category: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.skill_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateSkill
You can execute the `UpdateSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateSkill(options?: useDataConnectMutationOptions<UpdateSkillData, FirebaseError, UpdateSkillVariables>): UseDataConnectMutationResult<UpdateSkillData, UpdateSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSkillData, FirebaseError, UpdateSkillVariables>): UseDataConnectMutationResult<UpdateSkillData, UpdateSkillVariables>;
```

### Variables
The `UpdateSkill` Mutation requires an argument of type `UpdateSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateSkillVariables {
  id: UUIDString;
  name: string;
}
```
### Return Type
Recall that calling the `UpdateSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateSkill` Mutation is of type `UpdateSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateSkillData {
  skill_update?: Skill_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateSkillVariables } from '@dataconnect/generated';
import { useUpdateSkill } from '@dataconnect/generated/react'

export default function UpdateSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateSkill` Mutation requires an argument of type `UpdateSkillVariables`:
  const updateSkillVars: UpdateSkillVariables = {
    id: ..., 
    name: ..., 
  };
  mutation.mutate(updateSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.skill_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteSkill
You can execute the `DeleteSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteSkill(options?: useDataConnectMutationOptions<DeleteSkillData, FirebaseError, DeleteSkillVariables>): UseDataConnectMutationResult<DeleteSkillData, DeleteSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteSkill(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSkillData, FirebaseError, DeleteSkillVariables>): UseDataConnectMutationResult<DeleteSkillData, DeleteSkillVariables>;
```

### Variables
The `DeleteSkill` Mutation requires an argument of type `DeleteSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteSkillVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteSkill` Mutation is of type `DeleteSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteSkillData {
  skill_delete?: Skill_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteSkillVariables } from '@dataconnect/generated';
import { useDeleteSkill } from '@dataconnect/generated/react'

export default function DeleteSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteSkill` Mutation requires an argument of type `DeleteSkillVariables`:
  const deleteSkillVars: DeleteSkillVariables = {
    id: ..., 
  };
  mutation.mutate(deleteSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.skill_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## AddUserSkill
You can execute the `AddUserSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useAddUserSkill(options?: useDataConnectMutationOptions<AddUserSkillData, FirebaseError, AddUserSkillVariables>): UseDataConnectMutationResult<AddUserSkillData, AddUserSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useAddUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<AddUserSkillData, FirebaseError, AddUserSkillVariables>): UseDataConnectMutationResult<AddUserSkillData, AddUserSkillVariables>;
```

### Variables
The `AddUserSkill` Mutation requires an argument of type `AddUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface AddUserSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that calling the `AddUserSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `AddUserSkill` Mutation is of type `AddUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface AddUserSkillData {
  userSkill_insert: UserSkill_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `AddUserSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, AddUserSkillVariables } from '@dataconnect/generated';
import { useAddUserSkill } from '@dataconnect/generated/react'

export default function AddUserSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useAddUserSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useAddUserSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddUserSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useAddUserSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useAddUserSkill` Mutation requires an argument of type `AddUserSkillVariables`:
  const addUserSkillVars: AddUserSkillVariables = {
    skillId: ..., 
  };
  mutation.mutate(addUserSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ skillId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(addUserSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userSkill_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## RemoveUserSkill
You can execute the `RemoveUserSkill` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useRemoveUserSkill(options?: useDataConnectMutationOptions<RemoveUserSkillData, FirebaseError, RemoveUserSkillVariables>): UseDataConnectMutationResult<RemoveUserSkillData, RemoveUserSkillVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useRemoveUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<RemoveUserSkillData, FirebaseError, RemoveUserSkillVariables>): UseDataConnectMutationResult<RemoveUserSkillData, RemoveUserSkillVariables>;
```

### Variables
The `RemoveUserSkill` Mutation requires an argument of type `RemoveUserSkillVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface RemoveUserSkillVariables {
  skillId: UUIDString;
}
```
### Return Type
Recall that calling the `RemoveUserSkill` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `RemoveUserSkill` Mutation is of type `RemoveUserSkillData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface RemoveUserSkillData {
  userSkill_delete?: UserSkill_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `RemoveUserSkill`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, RemoveUserSkillVariables } from '@dataconnect/generated';
import { useRemoveUserSkill } from '@dataconnect/generated/react'

export default function RemoveUserSkillComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useRemoveUserSkill();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useRemoveUserSkill(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRemoveUserSkill(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useRemoveUserSkill(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useRemoveUserSkill` Mutation requires an argument of type `RemoveUserSkillVariables`:
  const removeUserSkillVars: RemoveUserSkillVariables = {
    skillId: ..., 
  };
  mutation.mutate(removeUserSkillVars);
  // Variables can be defined inline as well.
  mutation.mutate({ skillId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(removeUserSkillVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userSkill_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

