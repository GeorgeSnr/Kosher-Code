import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddUserSkillData {
  userSkill_insert: UserSkill_Key;
}

export interface AddUserSkillVariables {
  skillId: UUIDString;
}

export interface ConsultationRequest_Key {
  id: UUIDString;
  __typename?: 'ConsultationRequest_Key';
}

export interface ConsultationSession_Key {
  id: UUIDString;
  __typename?: 'ConsultationSession_Key';
}

export interface CreateConsultationRequestData {
  consultationRequest_insert: ConsultationRequest_Key;
}

export interface CreateConsultationRequestVariables {
  title: string;
  description: string;
  urgency: string;
}

export interface CreateConsultationSessionData {
  consultationSession_insert: ConsultationSession_Key;
}

export interface CreateConsultationSessionVariables {
  reqId: UUIDString;
  mentorId: UUIDString;
  start: TimestampString;
  end: TimestampString;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  sessionId: UUIDString;
  rating: number;
  comment: string;
}

export interface CreateSkillData {
  skill_insert: Skill_Key;
}

export interface CreateSkillVariables {
  name: string;
  category: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteConsultationRequestData {
  consultationRequest_delete?: ConsultationRequest_Key | null;
}

export interface DeleteConsultationRequestVariables {
  id: UUIDString;
}

export interface DeleteConsultationSessionData {
  consultationSession_delete?: ConsultationSession_Key | null;
}

export interface DeleteConsultationSessionVariables {
  id: UUIDString;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteSkillData {
  skill_delete?: Skill_Key | null;
}

export interface DeleteSkillVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetConsultationRequestData {
  consultationRequest?: {
    title: string;
    status: string;
    requester: {
      displayName: string;
    };
  };
}

export interface GetConsultationRequestVariables {
  id: UUIDString;
}

export interface GetMyUserData {
  user?: {
    displayName: string;
    email: string;
    bio?: string | null;
  };
}

export interface GetReviewData {
  review?: {
    rating: number;
    comment: string;
    reviewer: {
      displayName: string;
    };
  };
}

export interface GetReviewVariables {
  id: UUIDString;
}

export interface GetSessionData {
  consultationSession?: {
    status: string;
    notes?: string | null;
    mentor: {
      displayName: string;
    };
  };
}

export interface GetSessionVariables {
  id: UUIDString;
}

export interface GetSkillData {
  skill?: {
    name: string;
    category?: string | null;
  };
}

export interface GetSkillVariables {
  id: UUIDString;
}

export interface GetUserSkillsData {
  userSkills: ({
    skill: {
      name: string;
    };
  })[];
}

export interface ListAllSkillsData {
  skills: ({
    name: string;
    category?: string | null;
  })[];
}

export interface ListAllUsersData {
  users: ({
    displayName: string;
    role: string;
  })[];
}

export interface ListMyConsultationRequestsData {
  consultationRequests: ({
    title: string;
    status: string;
  })[];
}

export interface ListReviewsForSessionData {
  reviews: ({
    rating: number;
    comment: string;
  })[];
}

export interface ListReviewsForSessionVariables {
  sessionId: UUIDString;
}

export interface ListUpcomingSessionsData {
  consultationSessions: ({
    startDate: TimestampString;
    status: string;
  })[];
}

export interface ListUsersWithSkillData {
  userSkills: ({
    user: {
      displayName: string;
    };
  })[];
}

export interface ListUsersWithSkillVariables {
  skillId: UUIDString;
}

export interface RemoveUserSkillData {
  userSkill_delete?: UserSkill_Key | null;
}

export interface RemoveUserSkillVariables {
  skillId: UUIDString;
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Skill_Key {
  id: UUIDString;
  __typename?: 'Skill_Key';
}

export interface UpdateRequestStatusData {
  consultationRequest_update?: ConsultationRequest_Key | null;
}

export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateReviewData {
  review_update?: Review_Key | null;
}

export interface UpdateReviewVariables {
  id: UUIDString;
  rating: number;
  comment: string;
}

export interface UpdateSessionNotesData {
  consultationSession_update?: ConsultationSession_Key | null;
}

export interface UpdateSessionNotesVariables {
  id: UUIDString;
  notes: string;
}

export interface UpdateSkillData {
  skill_update?: Skill_Key | null;
}

export interface UpdateSkillVariables {
  id: UUIDString;
  name: string;
}

export interface UpdateUserBioData {
  user_update?: User_Key | null;
}

export interface UpdateUserBioVariables {
  bio: string;
}

export interface UserSkill_Key {
  userId: UUIDString;
  skillId: UUIDString;
  __typename?: 'UserSkill_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserBioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  operationName: string;
}
export const updateUserBioRef: UpdateUserBioRef;

export function updateUserBio(vars: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;
export function updateUserBio(dc: DataConnect, vars: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetMyUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyUserData, undefined>;
  operationName: string;
}
export const getMyUserRef: GetMyUserRef;

export function getMyUser(options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;
export function getMyUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserData, undefined>;

interface ListAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllUsersData, undefined>;
  operationName: string;
}
export const listAllUsersRef: ListAllUsersRef;

export function listAllUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;
export function listAllUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllUsersData, undefined>;

interface CreateConsultationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConsultationRequestVariables): MutationRef<CreateConsultationRequestData, CreateConsultationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateConsultationRequestVariables): MutationRef<CreateConsultationRequestData, CreateConsultationRequestVariables>;
  operationName: string;
}
export const createConsultationRequestRef: CreateConsultationRequestRef;

export function createConsultationRequest(vars: CreateConsultationRequestVariables): MutationPromise<CreateConsultationRequestData, CreateConsultationRequestVariables>;
export function createConsultationRequest(dc: DataConnect, vars: CreateConsultationRequestVariables): MutationPromise<CreateConsultationRequestData, CreateConsultationRequestVariables>;

interface UpdateRequestStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
  operationName: string;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;

export function updateRequestStatus(vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;
export function updateRequestStatus(dc: DataConnect, vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface DeleteConsultationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteConsultationRequestVariables): MutationRef<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteConsultationRequestVariables): MutationRef<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
  operationName: string;
}
export const deleteConsultationRequestRef: DeleteConsultationRequestRef;

export function deleteConsultationRequest(vars: DeleteConsultationRequestVariables): MutationPromise<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
export function deleteConsultationRequest(dc: DataConnect, vars: DeleteConsultationRequestVariables): MutationPromise<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;

interface GetConsultationRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetConsultationRequestVariables): QueryRef<GetConsultationRequestData, GetConsultationRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetConsultationRequestVariables): QueryRef<GetConsultationRequestData, GetConsultationRequestVariables>;
  operationName: string;
}
export const getConsultationRequestRef: GetConsultationRequestRef;

export function getConsultationRequest(vars: GetConsultationRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetConsultationRequestData, GetConsultationRequestVariables>;
export function getConsultationRequest(dc: DataConnect, vars: GetConsultationRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetConsultationRequestData, GetConsultationRequestVariables>;

interface ListMyConsultationRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyConsultationRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyConsultationRequestsData, undefined>;
  operationName: string;
}
export const listMyConsultationRequestsRef: ListMyConsultationRequestsRef;

export function listMyConsultationRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyConsultationRequestsData, undefined>;
export function listMyConsultationRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyConsultationRequestsData, undefined>;

interface CreateConsultationSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateConsultationSessionVariables): MutationRef<CreateConsultationSessionData, CreateConsultationSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateConsultationSessionVariables): MutationRef<CreateConsultationSessionData, CreateConsultationSessionVariables>;
  operationName: string;
}
export const createConsultationSessionRef: CreateConsultationSessionRef;

export function createConsultationSession(vars: CreateConsultationSessionVariables): MutationPromise<CreateConsultationSessionData, CreateConsultationSessionVariables>;
export function createConsultationSession(dc: DataConnect, vars: CreateConsultationSessionVariables): MutationPromise<CreateConsultationSessionData, CreateConsultationSessionVariables>;

interface UpdateSessionNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSessionNotesVariables): MutationRef<UpdateSessionNotesData, UpdateSessionNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSessionNotesVariables): MutationRef<UpdateSessionNotesData, UpdateSessionNotesVariables>;
  operationName: string;
}
export const updateSessionNotesRef: UpdateSessionNotesRef;

export function updateSessionNotes(vars: UpdateSessionNotesVariables): MutationPromise<UpdateSessionNotesData, UpdateSessionNotesVariables>;
export function updateSessionNotes(dc: DataConnect, vars: UpdateSessionNotesVariables): MutationPromise<UpdateSessionNotesData, UpdateSessionNotesVariables>;

interface DeleteConsultationSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteConsultationSessionVariables): MutationRef<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteConsultationSessionVariables): MutationRef<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
  operationName: string;
}
export const deleteConsultationSessionRef: DeleteConsultationSessionRef;

export function deleteConsultationSession(vars: DeleteConsultationSessionVariables): MutationPromise<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
export function deleteConsultationSession(dc: DataConnect, vars: DeleteConsultationSessionVariables): MutationPromise<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;

interface GetSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSessionVariables): QueryRef<GetSessionData, GetSessionVariables>;
  operationName: string;
}
export const getSessionRef: GetSessionRef;

export function getSession(vars: GetSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSessionData, GetSessionVariables>;
export function getSession(dc: DataConnect, vars: GetSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetSessionData, GetSessionVariables>;

interface ListUpcomingSessionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUpcomingSessionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUpcomingSessionsData, undefined>;
  operationName: string;
}
export const listUpcomingSessionsRef: ListUpcomingSessionsRef;

export function listUpcomingSessions(options?: ExecuteQueryOptions): QueryPromise<ListUpcomingSessionsData, undefined>;
export function listUpcomingSessions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUpcomingSessionsData, undefined>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface UpdateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  operationName: string;
}
export const updateReviewRef: UpdateReviewRef;

export function updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;
export function updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface GetReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  operationName: string;
}
export const getReviewRef: GetReviewRef;

export function getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;
export function getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface ListReviewsForSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewsForSessionVariables): QueryRef<ListReviewsForSessionData, ListReviewsForSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListReviewsForSessionVariables): QueryRef<ListReviewsForSessionData, ListReviewsForSessionVariables>;
  operationName: string;
}
export const listReviewsForSessionRef: ListReviewsForSessionRef;

export function listReviewsForSession(vars: ListReviewsForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsForSessionData, ListReviewsForSessionVariables>;
export function listReviewsForSession(dc: DataConnect, vars: ListReviewsForSessionVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsForSessionData, ListReviewsForSessionVariables>;

interface CreateSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  operationName: string;
}
export const createSkillRef: CreateSkillRef;

export function createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;
export function createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface UpdateSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSkillVariables): MutationRef<UpdateSkillData, UpdateSkillVariables>;
  operationName: string;
}
export const updateSkillRef: UpdateSkillRef;

export function updateSkill(vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;
export function updateSkill(dc: DataConnect, vars: UpdateSkillVariables): MutationPromise<UpdateSkillData, UpdateSkillVariables>;

interface DeleteSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSkillVariables): MutationRef<DeleteSkillData, DeleteSkillVariables>;
  operationName: string;
}
export const deleteSkillRef: DeleteSkillRef;

export function deleteSkill(vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;
export function deleteSkill(dc: DataConnect, vars: DeleteSkillVariables): MutationPromise<DeleteSkillData, DeleteSkillVariables>;

interface GetSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSkillVariables): QueryRef<GetSkillData, GetSkillVariables>;
  operationName: string;
}
export const getSkillRef: GetSkillRef;

export function getSkill(vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;
export function getSkill(dc: DataConnect, vars: GetSkillVariables, options?: ExecuteQueryOptions): QueryPromise<GetSkillData, GetSkillVariables>;

interface ListAllSkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllSkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllSkillsData, undefined>;
  operationName: string;
}
export const listAllSkillsRef: ListAllSkillsRef;

export function listAllSkills(options?: ExecuteQueryOptions): QueryPromise<ListAllSkillsData, undefined>;
export function listAllSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllSkillsData, undefined>;

interface AddUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddUserSkillVariables): MutationRef<AddUserSkillData, AddUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddUserSkillVariables): MutationRef<AddUserSkillData, AddUserSkillVariables>;
  operationName: string;
}
export const addUserSkillRef: AddUserSkillRef;

export function addUserSkill(vars: AddUserSkillVariables): MutationPromise<AddUserSkillData, AddUserSkillVariables>;
export function addUserSkill(dc: DataConnect, vars: AddUserSkillVariables): MutationPromise<AddUserSkillData, AddUserSkillVariables>;

interface RemoveUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveUserSkillVariables): MutationRef<RemoveUserSkillData, RemoveUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveUserSkillVariables): MutationRef<RemoveUserSkillData, RemoveUserSkillVariables>;
  operationName: string;
}
export const removeUserSkillRef: RemoveUserSkillRef;

export function removeUserSkill(vars: RemoveUserSkillVariables): MutationPromise<RemoveUserSkillData, RemoveUserSkillVariables>;
export function removeUserSkill(dc: DataConnect, vars: RemoveUserSkillVariables): MutationPromise<RemoveUserSkillData, RemoveUserSkillVariables>;

interface GetUserSkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserSkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserSkillsData, undefined>;
  operationName: string;
}
export const getUserSkillsRef: GetUserSkillsRef;

export function getUserSkills(options?: ExecuteQueryOptions): QueryPromise<GetUserSkillsData, undefined>;
export function getUserSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserSkillsData, undefined>;

interface ListUsersWithSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersWithSkillVariables): QueryRef<ListUsersWithSkillData, ListUsersWithSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsersWithSkillVariables): QueryRef<ListUsersWithSkillData, ListUsersWithSkillVariables>;
  operationName: string;
}
export const listUsersWithSkillRef: ListUsersWithSkillRef;

export function listUsersWithSkill(vars: ListUsersWithSkillVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersWithSkillData, ListUsersWithSkillVariables>;
export function listUsersWithSkill(dc: DataConnect, vars: ListUsersWithSkillVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersWithSkillData, ListUsersWithSkillVariables>;

