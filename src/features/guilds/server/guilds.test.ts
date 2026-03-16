import { describe, expect, it } from "vitest";
import { buildMembershipState } from "@/features/guilds/server/guilds";

describe("buildMembershipState", () => {
  it("returns anonymous when unauthenticated", () => {
    expect(buildMembershipState({ isAuthenticated: false })).toEqual({ kind: "anonymous" });
  });

  it("returns unaffiliated when no guild is present", () => {
    expect(
      buildMembershipState({
        isAuthenticated: true,
        username: "Wanderer",
      }),
    ).toEqual({
      kind: "unaffiliated",
      username: "Wanderer",
    });
  });

  it("returns member state for current guild", () => {
    expect(
      buildMembershipState({
        isAuthenticated: true,
        username: "Grom",
        guildId: "guild-1",
        guildName: "Forgemasters",
        currentGuildId: "guild-1",
      }),
    ).toEqual({
      kind: "member",
      username: "Grom",
      guildId: "guild-1",
      guildName: "Forgemasters",
      isCurrentGuild: true,
    });
  });

  it("returns member state for another guild", () => {
    expect(
      buildMembershipState({
        isAuthenticated: true,
        username: "Lysa",
        guildId: "guild-1",
        guildName: "Forgemasters",
        currentGuildId: "guild-2",
      }),
    ).toEqual({
      kind: "member",
      username: "Lysa",
      guildId: "guild-1",
      guildName: "Forgemasters",
      isCurrentGuild: false,
    });
  });
});
