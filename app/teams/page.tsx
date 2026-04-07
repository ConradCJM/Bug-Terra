"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { findUserByEmail } from "@/app/actions/findUserByEmail";

interface Team {
  id: string;
  name: string;
  created_at: string;
  member_count?: number;
}

interface TeamMember {
  user_id: string;
  role: string;
  profile?: {
    full_name: string;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("member");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user and teams on component mount
  useEffect(() => {
    const fetchUserAndTeams = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUser(user);
        await fetchTeams(user.id);
      }
    };

    fetchUserAndTeams();
  }, []);

  const fetchTeams = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name, created_at)")
        .eq("user_id", userId);

      if (error) throw error;

      const teamsData =
        data
          ?.map((member: any) => ({
            ...member.teams,
            role: member.role,
          }))
          .filter((team): team is Team => team && team.id && team.name) || [];

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    setIsLoadingMembers(true);
    try {
      // Fetch team members
      const { data: members, error: membersError } = await supabase
        .from("team_members")
        .select("user_id, role")
        .eq("team_id", teamId);

      if (membersError) throw membersError;

      if (!members || members.length === 0) {
        setTeamMembers([]);
        return;
      }

      // Fetch profiles for these users
      const userIds = members.map((m) => m.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const combinedData = members.map((member) => ({
        user_id: member.user_id,
        role: member.role,
        profile: {
          full_name:
            profiles?.find((p) => p.id === member.user_id)?.name ||
            "Unknown User",
        },
      }));

      setTeamMembers(combinedData);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTeamName.trim() || !currentUser) return;

    setIsCreating(true);
    try {
      // Create team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([{ name: newTeamName }])
        .select()
        .single();

      if (teamError) throw new Error(JSON.stringify(teamError));

      // Add current user as team owner
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: teamData.id,
            user_id: currentUser.id,
            role: "owner",
          },
        ]);

      if (memberError) throw new Error(JSON.stringify(memberError));

      setNewTeamName("");
      await fetchTeams(currentUser.id);
      alert("Team created successfully!");
    } catch (error: any) {
      console.error("Error creating team:", error.message || error);
      alert(`Failed to create team: ${error.message || "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectTeam = async (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
    await fetchTeamMembers(team.id);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeam || !memberEmail.trim()) return;

    try {
      // Find the user by email using server action
      const user = await findUserByEmail(memberEmail);

      if (!user) {
        alert("User not found");
        return;
      }

      // Check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from("team_members")
        .select()
        .eq("team_id", selectedTeam.id)
        .eq("user_id", user.id)
        .single();

      if (!checkError && existingMember) {
        alert("User is already a member of this team");
        return;
      }

      // Add user to team
      const { error: addError } = await supabase.from("team_members").insert([
        {
          team_id: selectedTeam.id,
          user_id: user.id,
          role: memberRole,
          created_at: new Date().toISOString(),
        },
      ]);

      if (addError) throw addError;

      setMemberEmail("");
      setMemberRole("member");
      await fetchTeamMembers(selectedTeam.id);
      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) return;

    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("team_id", selectedTeam.id)
        .eq("user_id", userId);

      if (error) throw error;

      await fetchTeamMembers(selectedTeam.id);
      alert("Member removed successfully!");
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Teams</h1>
          <p className="text-slate-400 mt-2">Create and manage your teams</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Team Section */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Create New Team
          </h2>
          <form onSubmit={handleCreateTeam} className="flex gap-3">
            <input
              type="text"
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isCreating ? "Creating..." : "Create Team"}
            </button>
          </form>
        </div>

        {/* Teams Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Teams</h2>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {team.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleSelectTeam(team)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Manage Members
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
              <p className="text-slate-400">
                No teams yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Team Members Modal */}
      {isModalOpen && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedTeam.name}
                  </h3>
                  <p className="text-sm text-slate-600">Manage team members</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Add Member Form */}
              <form onSubmit={handleAddMember} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Add Member
                  </label>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Add Member
                </button>
              </form>

              <div className="border-t border-slate-200" />

              {/* Members List */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Members</h4>
                {isLoadingMembers ? (
                  <p className="text-sm text-slate-600">Loading members...</p>
                ) : teamMembers.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {(member.profile as any)?.full_name ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {member.role}
                          </p>
                        </div>
                        {member.user_id !== currentUser?.id && (
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="ml-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">No members yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
