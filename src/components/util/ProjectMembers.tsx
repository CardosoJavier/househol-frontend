import { useEffect, useState } from "react";
import { removeProjectMember, transferProjectOwnership } from "../../api";
import type { ProjectMember } from "../../api/projects/getProjectMembers";
import { CustomButton } from "../index";
import { useAuth } from "../../context";
import { useProjectContext } from "../../context/ProjectContext";
import { showToast } from "../notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";
import { MdDelete } from 'react-icons/md';
import { GiCrown } from 'react-icons/gi';
import { GridLoader } from "react-spinners";

interface ProjectMembersProps {
  projectId: string;
  projectOwnerId: string;
  onClose: () => void;
}

export default function ProjectMembers({
  projectId,
  projectOwnerId,
  onClose,
}: ProjectMembersProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [transferringOwnership, setTransferringOwnership] = useState<boolean>(false);

  const { personalInfo } = useAuth();
  const {
    getProjectMembersFromCache,
    refreshProjectMembers,
    invalidateProjectMembersCache,
  } = useProjectContext();
  const isOwner = personalInfo?.id === projectOwnerId;

  useEffect(() => {
    fetchMembers();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchMembers() {
    try {
      setLoading(true);

      // Check cache first
      const cachedMembers = getProjectMembersFromCache(projectId);
      if (cachedMembers) {
        setMembers(cachedMembers);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const membersData = await refreshProjectMembers(projectId);
      if (membersData) {
        setMembers(membersData);
      }
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.PROJECT_LOAD_FAILED
      );
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (memberId === personalInfo?.id) {
      showToast("You cannot remove yourself from the project", "error");
      return;
    }

    if (memberId === projectOwnerId) {
      showToast("Cannot remove the project owner", "error");
      return;
    }

    try {
      setRemovingMemberId(memberId);
      const success = await removeProjectMember(projectId, memberId);

      if (success) {
        // Invalidate cache and update local state
        invalidateProjectMembersCache(projectId);
        setMembers(members.filter((member) => member.id !== memberId));
      }
    } catch (error) {
      const errorMessage = handleError(
        error,
        GENERIC_ERROR_MESSAGES.MEMBER_REMOVE_FAILED
      );
      showToast(errorMessage, "error");
    } finally {
      setRemovingMemberId(null);
    }
  }

  return (
    <>
      {/* Title and member count */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-2xl">Project Members</h3>
          <span className="text-sm text-gray-500">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Members content */}
      <div className="mt-5 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <GridLoader size={8} />
            <span className="text-sm font-medium text-gray-500">
              Loading members...
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
            {members.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No members found
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {member.firstName} {member.lastName}
                      {member.id === projectOwnerId && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">
                      {member.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isOwner && member.id !== projectOwnerId && member.id !== personalInfo?.id && (
                      <>
                        <button
                          onClick={async () => {
                            setTransferringOwnership(true);
                            try {
                              const success = await transferProjectOwnership(projectId, member.id);
                              if (success) {
                                await refreshProjectMembers(projectId);
                                onClose();
                              }
                            } catch (error) {
                              console.error('Error transferring ownership:', error);
                            }
                            setTransferringOwnership(false);
                          }}
                          disabled={transferringOwnership}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
                          title="Transfer project ownership"
                        >
                          {transferringOwnership ? (
                            <GridLoader size={3} color="#9333ea" />
                          ) : (
                            <>
                              <GiCrown className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Make Owner</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removingMemberId === member.id}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Remove member"
                        >
                          {removingMemberId === member.id ? (
                            <GridLoader size={3} />
                          ) : (
                            <>
                              <MdDelete className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Close button */}
        <div className="grid grid-cols-1 gap-4 pt-3 border-t">
          <CustomButton label="Close" type="button" onClick={onClose} />
        </div>
      </div>
    </>
  );
}
