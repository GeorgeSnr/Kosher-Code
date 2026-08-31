import { CreateUserData, UpdateUserBioData, UpdateUserBioVariables, DeleteUserData, GetMyUserData, ListAllUsersData, CreateConsultationRequestData, CreateConsultationRequestVariables, UpdateRequestStatusData, UpdateRequestStatusVariables, DeleteConsultationRequestData, DeleteConsultationRequestVariables, GetConsultationRequestData, GetConsultationRequestVariables, ListMyConsultationRequestsData, CreateConsultationSessionData, CreateConsultationSessionVariables, UpdateSessionNotesData, UpdateSessionNotesVariables, DeleteConsultationSessionData, DeleteConsultationSessionVariables, GetSessionData, GetSessionVariables, ListUpcomingSessionsData, CreateReviewData, CreateReviewVariables, UpdateReviewData, UpdateReviewVariables, DeleteReviewData, DeleteReviewVariables, GetReviewData, GetReviewVariables, ListReviewsForSessionData, ListReviewsForSessionVariables, CreateSkillData, CreateSkillVariables, UpdateSkillData, UpdateSkillVariables, DeleteSkillData, DeleteSkillVariables, GetSkillData, GetSkillVariables, ListAllSkillsData, AddUserSkillData, AddUserSkillVariables, RemoveUserSkillData, RemoveUserSkillVariables, GetUserSkillsData, ListUsersWithSkillData, ListUsersWithSkillVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useUpdateUserBio(options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;
export function useUpdateUserBio(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserBioData, FirebaseError, UpdateUserBioVariables>): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetMyUser(options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;
export function useGetMyUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserData>): UseDataConnectQueryResult<GetMyUserData, undefined>;

export function useListAllUsers(options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;
export function useListAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllUsersData>): UseDataConnectQueryResult<ListAllUsersData, undefined>;

export function useCreateConsultationRequest(options?: useDataConnectMutationOptions<CreateConsultationRequestData, FirebaseError, CreateConsultationRequestVariables>): UseDataConnectMutationResult<CreateConsultationRequestData, CreateConsultationRequestVariables>;
export function useCreateConsultationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConsultationRequestData, FirebaseError, CreateConsultationRequestVariables>): UseDataConnectMutationResult<CreateConsultationRequestData, CreateConsultationRequestVariables>;

export function useUpdateRequestStatus(options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
export function useUpdateRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;

export function useDeleteConsultationRequest(options?: useDataConnectMutationOptions<DeleteConsultationRequestData, FirebaseError, DeleteConsultationRequestVariables>): UseDataConnectMutationResult<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;
export function useDeleteConsultationRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteConsultationRequestData, FirebaseError, DeleteConsultationRequestVariables>): UseDataConnectMutationResult<DeleteConsultationRequestData, DeleteConsultationRequestVariables>;

export function useGetConsultationRequest(vars: GetConsultationRequestVariables, options?: useDataConnectQueryOptions<GetConsultationRequestData>): UseDataConnectQueryResult<GetConsultationRequestData, GetConsultationRequestVariables>;
export function useGetConsultationRequest(dc: DataConnect, vars: GetConsultationRequestVariables, options?: useDataConnectQueryOptions<GetConsultationRequestData>): UseDataConnectQueryResult<GetConsultationRequestData, GetConsultationRequestVariables>;

export function useListMyConsultationRequests(options?: useDataConnectQueryOptions<ListMyConsultationRequestsData>): UseDataConnectQueryResult<ListMyConsultationRequestsData, undefined>;
export function useListMyConsultationRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyConsultationRequestsData>): UseDataConnectQueryResult<ListMyConsultationRequestsData, undefined>;

export function useCreateConsultationSession(options?: useDataConnectMutationOptions<CreateConsultationSessionData, FirebaseError, CreateConsultationSessionVariables>): UseDataConnectMutationResult<CreateConsultationSessionData, CreateConsultationSessionVariables>;
export function useCreateConsultationSession(dc: DataConnect, options?: useDataConnectMutationOptions<CreateConsultationSessionData, FirebaseError, CreateConsultationSessionVariables>): UseDataConnectMutationResult<CreateConsultationSessionData, CreateConsultationSessionVariables>;

export function useUpdateSessionNotes(options?: useDataConnectMutationOptions<UpdateSessionNotesData, FirebaseError, UpdateSessionNotesVariables>): UseDataConnectMutationResult<UpdateSessionNotesData, UpdateSessionNotesVariables>;
export function useUpdateSessionNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSessionNotesData, FirebaseError, UpdateSessionNotesVariables>): UseDataConnectMutationResult<UpdateSessionNotesData, UpdateSessionNotesVariables>;

export function useDeleteConsultationSession(options?: useDataConnectMutationOptions<DeleteConsultationSessionData, FirebaseError, DeleteConsultationSessionVariables>): UseDataConnectMutationResult<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;
export function useDeleteConsultationSession(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteConsultationSessionData, FirebaseError, DeleteConsultationSessionVariables>): UseDataConnectMutationResult<DeleteConsultationSessionData, DeleteConsultationSessionVariables>;

export function useGetSession(vars: GetSessionVariables, options?: useDataConnectQueryOptions<GetSessionData>): UseDataConnectQueryResult<GetSessionData, GetSessionVariables>;
export function useGetSession(dc: DataConnect, vars: GetSessionVariables, options?: useDataConnectQueryOptions<GetSessionData>): UseDataConnectQueryResult<GetSessionData, GetSessionVariables>;

export function useListUpcomingSessions(options?: useDataConnectQueryOptions<ListUpcomingSessionsData>): UseDataConnectQueryResult<ListUpcomingSessionsData, undefined>;
export function useListUpcomingSessions(dc: DataConnect, options?: useDataConnectQueryOptions<ListUpcomingSessionsData>): UseDataConnectQueryResult<ListUpcomingSessionsData, undefined>;

export function useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
export function useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;

export function useUpdateReview(options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;
export function useUpdateReview(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReviewData, FirebaseError, UpdateReviewVariables>): UseDataConnectMutationResult<UpdateReviewData, UpdateReviewVariables>;

export function useDeleteReview(options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
export function useDeleteReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;

export function useGetReview(vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;
export function useGetReview(dc: DataConnect, vars: GetReviewVariables, options?: useDataConnectQueryOptions<GetReviewData>): UseDataConnectQueryResult<GetReviewData, GetReviewVariables>;

export function useListReviewsForSession(vars: ListReviewsForSessionVariables, options?: useDataConnectQueryOptions<ListReviewsForSessionData>): UseDataConnectQueryResult<ListReviewsForSessionData, ListReviewsForSessionVariables>;
export function useListReviewsForSession(dc: DataConnect, vars: ListReviewsForSessionVariables, options?: useDataConnectQueryOptions<ListReviewsForSessionData>): UseDataConnectQueryResult<ListReviewsForSessionData, ListReviewsForSessionVariables>;

export function useCreateSkill(options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
export function useCreateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;

export function useUpdateSkill(options?: useDataConnectMutationOptions<UpdateSkillData, FirebaseError, UpdateSkillVariables>): UseDataConnectMutationResult<UpdateSkillData, UpdateSkillVariables>;
export function useUpdateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSkillData, FirebaseError, UpdateSkillVariables>): UseDataConnectMutationResult<UpdateSkillData, UpdateSkillVariables>;

export function useDeleteSkill(options?: useDataConnectMutationOptions<DeleteSkillData, FirebaseError, DeleteSkillVariables>): UseDataConnectMutationResult<DeleteSkillData, DeleteSkillVariables>;
export function useDeleteSkill(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSkillData, FirebaseError, DeleteSkillVariables>): UseDataConnectMutationResult<DeleteSkillData, DeleteSkillVariables>;

export function useGetSkill(vars: GetSkillVariables, options?: useDataConnectQueryOptions<GetSkillData>): UseDataConnectQueryResult<GetSkillData, GetSkillVariables>;
export function useGetSkill(dc: DataConnect, vars: GetSkillVariables, options?: useDataConnectQueryOptions<GetSkillData>): UseDataConnectQueryResult<GetSkillData, GetSkillVariables>;

export function useListAllSkills(options?: useDataConnectQueryOptions<ListAllSkillsData>): UseDataConnectQueryResult<ListAllSkillsData, undefined>;
export function useListAllSkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllSkillsData>): UseDataConnectQueryResult<ListAllSkillsData, undefined>;

export function useAddUserSkill(options?: useDataConnectMutationOptions<AddUserSkillData, FirebaseError, AddUserSkillVariables>): UseDataConnectMutationResult<AddUserSkillData, AddUserSkillVariables>;
export function useAddUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<AddUserSkillData, FirebaseError, AddUserSkillVariables>): UseDataConnectMutationResult<AddUserSkillData, AddUserSkillVariables>;

export function useRemoveUserSkill(options?: useDataConnectMutationOptions<RemoveUserSkillData, FirebaseError, RemoveUserSkillVariables>): UseDataConnectMutationResult<RemoveUserSkillData, RemoveUserSkillVariables>;
export function useRemoveUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<RemoveUserSkillData, FirebaseError, RemoveUserSkillVariables>): UseDataConnectMutationResult<RemoveUserSkillData, RemoveUserSkillVariables>;

export function useGetUserSkills(options?: useDataConnectQueryOptions<GetUserSkillsData>): UseDataConnectQueryResult<GetUserSkillsData, undefined>;
export function useGetUserSkills(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserSkillsData>): UseDataConnectQueryResult<GetUserSkillsData, undefined>;

export function useListUsersWithSkill(vars: ListUsersWithSkillVariables, options?: useDataConnectQueryOptions<ListUsersWithSkillData>): UseDataConnectQueryResult<ListUsersWithSkillData, ListUsersWithSkillVariables>;
export function useListUsersWithSkill(dc: DataConnect, vars: ListUsersWithSkillVariables, options?: useDataConnectQueryOptions<ListUsersWithSkillData>): UseDataConnectQueryResult<ListUsersWithSkillData, ListUsersWithSkillVariables>;
