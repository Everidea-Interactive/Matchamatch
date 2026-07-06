"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";

const primaryMenuItems = [
  {
    icon: <GiftIcon />,
    label: "Subscription",
  },
  {
    icon: <TicketIcon />,
    label: "Voucher",
  },
  {
    icon: <SparkIcon />,
    label: "Loyalty Membership",
  },
  {
    icon: <ShareIcon />,
    label: "Referral",
  },
] as const;

const secondaryMenuItems = [
  {
    icon: <ShieldIcon />,
    label: "Privacy Policy",
  },
  {
    icon: <PowerIcon />,
    label: "Log Out",
  },
] as const;

export function AccountPage() {
  const memberNumber = useMemo(() => createRandomMemberNumber(), []);
  const accumulatedPoints = "1,240";

  return (
    <main className="mx-auto min-h-[100svh] w-full max-w-md px-2 py-2 sm:min-h-screen sm:px-4 sm:py-6">
      <div className="mm-shell-in rounded-[30px] border border-[var(--mm-border)] bg-[linear-gradient(180deg,var(--mm-shell-top),var(--mm-shell-bottom))] p-2.5 shadow-[0_20px_48px_rgba(var(--mm-shadow-rgb),0.08)] backdrop-blur-sm sm:rounded-[36px] sm:p-4 sm:shadow-[0_24px_64px_rgba(var(--mm-shadow-rgb),0.1)]">
        <header className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
          <Link
            aria-label="Back to home"
            className="mm-button flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[var(--mm-border)] bg-[rgba(255,249,241,0.9)] text-[var(--mm-ink-strong)] shadow-[0_10px_24px_rgba(var(--mm-shadow-rgb),0.08)] sm:h-12 sm:w-12 sm:rounded-[24px]"
            href="/"
          >
            <HomeIcon />
          </Link>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--mm-muted)]">
              Member profile
            </p>
            <h1 className="mt-1 text-[1.9rem] leading-[0.98] font-bold tracking-[-0.05em] text-[var(--mm-ink-strong)] sm:text-[2.25rem]">
              Account
            </h1>
          </div>
        </header>

        <section className="space-y-4 sm:space-y-5">
          <article className="mm-card-sheen rounded-[28px] border border-white/72 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_40px_rgba(var(--mm-shadow-rgb),0.1)] sm:rounded-[32px] sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-[rgba(223,208,191,0.96)] bg-[linear-gradient(180deg,rgba(236,223,208,0.98),rgba(223,208,191,0.96))] text-[var(--mm-sage-deep)] shadow-[0_12px_24px_rgba(154,133,110,0.14)] sm:h-16 sm:w-16 sm:rounded-[24px]">
                <ProfileIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[1.35rem] leading-tight font-bold tracking-[-0.04em] text-[var(--mm-ink-strong)] sm:text-[1.55rem]">
                  Matcha Guest
                </p>
                <p className="mt-1 text-[0.98rem] font-medium text-[var(--mm-muted)] sm:text-[1.02rem]">
                  {memberNumber}
                </p>
              </div>
              <button
                aria-label="Edit account"
                className="mm-button flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] border border-[var(--mm-border)] bg-[var(--mm-surface-raised)] text-[var(--mm-ink-strong)] shadow-[0_10px_20px_rgba(var(--mm-shadow-rgb),0.08)] sm:h-11 sm:w-11 sm:rounded-[20px]"
                type="button"
              >
                <EditIcon />
              </button>
            </div>
          </article>

          <article className="mm-card-sheen rounded-[28px] border border-white/72 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_40px_rgba(var(--mm-shadow-rgb),0.1)] sm:rounded-[32px] sm:p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,var(--mm-sage-soft),rgba(184,201,157,0.9))] text-[var(--mm-sage-deep)] shadow-[0_10px_22px_rgba(123,141,93,0.15)] sm:h-16 sm:w-16 sm:rounded-[24px]">
                <SparkIcon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--mm-muted)]">
                  Total points
                </p>
                <p className="mt-2 text-[2rem] leading-none font-bold tracking-[-0.05em] text-[var(--mm-ink-strong)] sm:text-[2.25rem]">
                  {accumulatedPoints}
                </p>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] border border-[rgba(132,149,107,0.3)] bg-[linear-gradient(180deg,rgba(217,228,202,0.98),rgba(184,201,157,0.92))] shadow-[0_18px_40px_rgba(123,141,93,0.18)] sm:rounded-[32px]">
            <div className="bg-[rgba(118,137,92,0.96)] px-5 py-3.5 text-[1rem] font-semibold text-[#fffdf6] sm:px-6 sm:text-[1.05rem]">
              Invite friends and earn points
            </div>
            <div className="flex items-center gap-3 px-5 py-5 sm:px-6 sm:py-6">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[rgba(79,62,49,0.65)]">
                  Referral code
                </p>
                <p className="mt-2 text-[2.15rem] leading-none font-bold tracking-[0.08em] text-[#fffdf6] drop-shadow-[0_8px_16px_rgba(79,62,49,0.16)] sm:text-[2.45rem]">
                  955EEN
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  aria-label="Copy referral code"
                  className="mm-button flex h-11 w-11 items-center justify-center rounded-[20px] border border-white/30 bg-white/16 text-[#fffdf6] shadow-[0_12px_24px_rgba(79,62,49,0.12)] backdrop-blur-sm sm:h-12 sm:w-12 sm:rounded-[22px]"
                  type="button"
                >
                  <CopyIcon />
                </button>
                <button
                  aria-label="Share referral code"
                  className="mm-button flex h-11 w-11 items-center justify-center rounded-[20px] border border-white/30 bg-white/16 text-[#fffdf6] shadow-[0_12px_24px_rgba(79,62,49,0.12)] backdrop-blur-sm sm:h-12 sm:w-12 sm:rounded-[22px]"
                  type="button"
                >
                  <ShareIcon />
                </button>
              </div>
            </div>
          </article>

          <MenuCard items={primaryMenuItems} />
          <MenuCard items={secondaryMenuItems} />
        </section>
      </div>
    </main>
  );
}

function createRandomMemberNumber() {
  return Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join("");
}

function MenuCard({
  items,
}: {
  items: ReadonlyArray<{
    icon: ReactNode;
    label: string;
  }>;
}) {
  return (
    <article className="mm-card-sheen rounded-[28px] border border-white/72 bg-[linear-gradient(180deg,var(--mm-card-top),var(--mm-card-bottom))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_40px_rgba(var(--mm-shadow-rgb),0.1)] sm:rounded-[32px] sm:p-3">
      {items.map((item, index) => (
        <div key={item.label}>
          <button
            className="mm-button flex w-full items-center gap-3 rounded-[24px] px-3 py-3.5 text-left sm:px-4 sm:py-4"
            type="button"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,var(--mm-sage-soft),rgba(184,201,157,0.9))] text-[var(--mm-sage-deep)] shadow-[0_10px_22px_rgba(123,141,93,0.15)]">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1 text-[1.02rem] font-semibold text-[var(--mm-ink-strong)] sm:text-[1.08rem]">
              {item.label}
            </span>
            <ChevronIcon />
          </button>
          {index < items.length - 1 ? (
            <div
              aria-hidden="true"
              className="mx-3 h-px bg-[linear-gradient(90deg,transparent,rgba(154,134,117,0.34),transparent)] sm:mx-4"
            />
          ) : null}
        </div>
      ))}
    </article>
  );
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4.75 10.75 12 5l7.25 5.75v7a1.5 1.5 0 0 1-1.5 1.5H6.25a1.5 1.5 0 0 1-1.5-1.5v-7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.25 19.25v-5.5h5.5v5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 sm:h-9 sm:w-9"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5.25 19.25a6.75 6.75 0 0 1 13.5 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5.75 18.25 3.15-.7 8.2-8.2a1.6 1.6 0 1 0-2.26-2.27l-8.2 8.2-.7 3.17h-.19Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m13.75 8.25 2 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M9.25 7.25h8.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-8.5a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M5.75 15.25v-9a1.5 1.5 0 0 1 1.5-1.5h8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-[var(--mm-muted)]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m9 6.75 5.25 5.25L9 17.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5.75 10.25h12.5v8a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M4.75 7.25h14.5v3H4.75v-3ZM12 7.25v12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.5 7.25c-1.4 0-2.25-.75-2.25-1.8 0-1.13.95-1.95 2.2-1.95 1.5 0 2.55 1.43 2.55 3.75M14.5 7.25c1.4 0 2.25-.75 2.25-1.8 0-1.13-.95-1.95-2.2-1.95-1.5 0-2.55 1.43-2.55 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5.75 8.25a2 2 0 0 0 0 4 2 2 0 0 0 0 4h12.5a2 2 0 0 0 0-4 2 2 0 0 0 0-4H5.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M12 8.5v1.25m0 2v1.25m0 2v1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m12 4.75 1.62 3.72 4.13.35-3.12 2.7.93 4.03L12 13.45l-3.56 2.1.93-4.03-3.12-2.7 4.13-.35L12 4.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.25 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM16.75 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM16.75 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m9.45 10.9 5.1-2.8m-5.1 5 5.1 2.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.75c1.8 1.4 4.03 2.14 6.3 2.1v4.4c0 4.12-2.27 6.86-6.3 8-4.03-1.14-6.3-3.88-6.3-8v-4.4c2.27.04 4.5-.7 6.3-2.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.6 12.2 11.2 13.8l3.2-3.35"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.75v6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M8.02 6.5a6.25 6.25 0 1 0 7.96 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
