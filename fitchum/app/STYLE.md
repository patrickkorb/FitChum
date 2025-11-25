<!DOCTYPE html>
<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>FitChum Feed</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
<script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "primary": "#00E599",
            "primary-hover": "#00C280",
            "secondary": "#7A52F4",
            "accent-gold": "#FFC700",
            "accent-silver": "#C0C0C0",
            "accent-bronze": "#CD7F32",
            "accent-red": "#FF4D4D",
            "background-light": "#F0F2F5",
            "background-dark": "#0A0A0A",
            "card-light": "#FFFFFF",
            "card-dark": "#1C1C1E",
            "text-light": "#1C1C1E",
            "text-dark": "#E5E5E5",
            "subtext-light": "#6D6D72",
            "subtext-dark": "#8E8E93",
            "border-light": "#E5E7EB",
            "border-dark": "#3A3A3C",
          },
          fontFamily: {
            sans: ["Inter", "sans-serif"],
          },
          borderRadius: {
            "DEFAULT": "0.75rem",
            "lg": "1rem",
            "xl": "1.25rem",
          },
          boxShadow: {
            "glow-primary": "0 0 15px 0 rgba(0, 229, 153, 0.5)",
            "glow-secondary": "0 0 15px 0 rgba(122, 82, 244, 0.4)",
          },
        },
      },
    }
  </script>
<style>
    body {
      min-height: max(884px, 100dvh);
      font-family: 'Inter', sans-serif;
    }
    .text-glow {
      text-shadow: 0 0 8px rgba(0, 229, 153, 0.7);
    }
    .icon-glow {
      filter: drop-shadow(0 0 5px rgba(255, 199, 0, 0.8));
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div class="sticky top-0 z-20 flex flex-col bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg">
<div class="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-accent-gold text-3xl icon-glow">local_fire_department</span>
<span class="text-2xl font-bold text-accent-gold text-glow">125</span>
</div>
<h1 class="text-xl font-bold text-text-light dark:text-text-dark">Activity Feed</h1>
<button class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-glow-secondary active:scale-95 transition-transform duration-150">
<span class="material-symbols-outlined text-2xl">add</span>
</button>
</div>
</div>
<div class="flex flex-1 flex-col">
<div class="p-4">
<h2 class="text-lg font-semibold mb-3 text-text-light dark:text-text-dark px-1">Weekly Leaderboard</h2>
<div class="grid grid-cols-3 gap-3">
<div class="flex flex-col items-center">
<div class="relative mb-2">
<img alt="Profile picture of Jane Doe" class="h-16 w-16 rounded-full object-cover border-4 border-accent-silver" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGAV0M00GKoEreIwUWy6sT4SZyOQxeI3o_Pu8jkzj3v0uFzcgtrR8UWwlYzbPBh9JWQTeH8vJXAKOtrOGA6uUmn9EihdOneu80mxcncpQ-ViPmBN_HZVs_BVs-zl8O-O0AUypOgTqucH86PcZKc-zEBsofKDODDp-A14jLDmIwmaIR-g7ltXYIPz6dQRJm485kLnU_v10J9LC_kiIDD7HGDUvZ1tpf_vWkRvH6L9YYa-dI_0Wz9I24ySI5W1UKDzamREbDZB3-MMeI"/>
<div class="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-silver border-2 border-card-light dark:border-card-dark text-sm font-bold text-white">2</div>
</div>
<p class="font-semibold text-sm truncate">Jane D.</p>
<p class="text-xs font-medium text-subtext-light dark:text-subtext-dark">5 workouts</p>
</div>
<div class="flex flex-col items-center -mt-4">
<div class="relative mb-2">
<img alt="Profile picture of John Appleseed" class="h-20 w-20 rounded-full object-cover border-4 border-accent-gold" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmaFRADrlQH8ZNBb8nGA_OOdplJxudEGCadmJN7tGY7JjOTux1de3m8bFCrfIK7GvsW0kuo8e48ymL0uiV7o8-z0b_PqZ-iQfGvYH88D7rGq4PD0NaSlUIKZzhLfdt3x_YuCEaMyhhvvzMuDyxJsNC7lRPDRdr_WTT4nywoWf2Cyq38wfKN-bdamGoFvnmFfixiN73xhW25xtxCoKBTpoq6VOsV1lnfP9iAbsNrGvlGyKh1ilzJYbv3zpJ5ng0yz5NnnpWKEMVjfeC"/>
<div class="absolute -bottom-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold border-2 border-card-light dark:border-card-dark text-base font-bold text-white">1</div>
</div>
<p class="font-bold text-base truncate">John A.</p>
<p class="text-sm font-medium text-subtext-light dark:text-subtext-dark">7 workouts</p>
</div>
<div class="flex flex-col items-center">
<div class="relative mb-2">
<img alt="Profile picture of Alex Ray" class="h-16 w-16 rounded-full object-cover border-4 border-accent-bronze" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB58TSuyWFXrmDUr5aetiz_5vU74Cb7bRYyN0QRHnpHrlegpFRmWyo8Tvzt5JJV73383pxGYQUTRY8jrmfdNW5Q2SLN5jKz_TMbzyyjCeNPokjv5ALmq1KTQGJ_o8aHc-4ngZXjmFj2Cbi3jupVOGN0JZgAj0YfkWThei5BhWE4YBL2MAK3UR3TUpuTKyCbZbX6QeK1sssbuwycatU2xk6TQ5m14nLjBtxR5wpTUBZAKlEGRIpNoQ1OxB7IwQ4FcMEuO1OrlszfzC5Y"/>
<div class="absolute -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-bronze border-2 border-card-light dark:border-card-dark text-sm font-bold text-white">3</div>
</div>
<p class="font-semibold text-sm truncate">Alex R.</p>
<p class="text-xs font-medium text-subtext-light dark:text-subtext-dark">4 workouts</p>
</div>
</div>
</div>
<div class="flex flex-col gap-4 p-4 pt-2">
<div class="flex flex-col rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
<div class="flex items-center gap-3 p-4">
<img alt="Profile picture of a smiling man" class="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmaFRADrlQH8ZNBb8nGA_OOdplJxudEGCadmJN7tGY7JjOTux1de3m8bFCrfIK7GvsW0kuo8e48ymL0uiV7o8-z0b_PqZ-iQfGvYH88D7rGq4PD0NaSlUIKZzhLfdt3x_YuCEaMyhhvvzMuDyxJsNC7lRPDRdr_WTT4nywoWf2Cyq38wfKN-bdamGoFvnmFfixiN73xhW25xtxCoKBTpoq6VOsV1lnfP9iAbsNrGvlGyKh1ilzJYbv3zpJ5ng0yz5NnnpWKEMVjfeC"/>
<div class="flex-1">
<p class="font-bold text-text-light dark:text-text-dark">John Appleseed</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">Mission Complete! • 15m ago</p>
</div>
<div class="flex items-center gap-1 rounded-full bg-primary/10 dark:bg-primary/20 px-3 py-1.5">
<span class="material-symbols-outlined text-primary text-xl">military_tech</span>
<p class="font-bold text-primary">Streak +1</p>
</div>
</div>
<div class="relative mx-4 mb-4 aspect-video w-auto rounded-lg bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDV5HKXB7H1zZdM-p1rzpILmvN7MrR6H11i2EDnJyMd88guN4AYhOT6lLoqHcVtuNe5uuWFZnbG9WYRH7zY6xY1WkLRReWgb03hrK9wDIga3m8lvVB-pFW4GhEGEox87vdcS4QEVv0NU2OV6ECvR7G1aeLIRWQ3lZfqL3xmhQMD5SL3kZtAfUsGqS_yWiemTdMHyoEHvkdPSK2BzCqbmnXSXcMKHuIp-VDlfwzsOHAdMJ9ZrpeGdgji99iTGO-6yvJelfnWM1tbJBSf')">
<img alt="Selfie of the person who completed the workout" class="absolute left-3 top-3 h-1/3 w-1/4 rounded-md border-2 border-white object-cover dark:border-card-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCatvfOQ1sXXEW-f5iBOjJ9DT8U18w5fgMBxzhFoeN_KnTi7ztvuIt5LzBcosAkLjeESgVP5dXNDWm0pfxRdYEhBVIX2mUE9Arle2vW0XcpUFIx1ySUO0FZQPWnm5qODS4VRPEsqQeV41tnC2yf1JrNUJngqdlBF52tT5dx6S15fzm4FXtnTfqiIr2VZX2AabPKSJufSL7cJK1O7ykuIjNobF7BHcmxnxicwKNY9ZznCjYaDyo_DsDlFxHGSEVv3rh2eIVjMcnALqoJ"/>
</div>
<div class="px-4 pb-4">
<p class="font-semibold text-text-light dark:text-white">Crushed the 'Sunrise Runner' challenge.</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">5k run in 25:12</p>
</div>
<div class="flex items-center justify-start gap-2 border-t border-border-light dark:border-border-dark px-4 py-3">
<button class="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1.5 active:scale-95 transition-transform duration-150">
<span class="material-symbols-outlined text-lg text-accent-red">local_fire_department</span>
<span class="text-sm font-semibold text-text-light dark:text-text-dark">5</span>
</button>
<button class="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1.5 active:scale-95 transition-transform duration-150">
<span class="material-symbols-outlined text-lg text-secondary">mode_comment</span>
<span class="text-sm font-semibold text-text-light dark:text-text-dark">3</span>
</button>
</div>
</div>
<div class="flex flex-col rounded-xl bg-secondary/10 dark:bg-secondary/20 border border-secondary/20 dark:border-secondary/30 p-4 gap-4">
<div class="flex items-center gap-3">
<img alt="Profile picture of Sarah Lane" class="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZVOdJDRc5u8Nlq5vgBcrdFpt7P9MNEwfuS7f0AWg5HK1gSofKnfHdx0YyRp2xEoKu6aE2CoGxQGV8R_Xat-s8v-15yK-H5jkV5CgjRXIm_aK-hHocawsMM5vh3S45GTNlxdadk9rmAbzqDu9uDZfRPUnzy4bMhuCNzQXpKVojTbCDE93Ssri_suqvwi3IBog-KwC9zmeUIeXYUt5wnX5GEF-VLifRrs0sx1gNFL8vjCYZ3I_JY0z1eKgd6mQ2ef8-mKsAFkxFHhuz"/>
<div class="flex-1">
<p class="font-bold text-text-light dark:text-text-dark">Sarah Lane hasn't worked out yet.</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">Help her keep the streak going!</p>
</div>
</div>
<button class="w-full rounded-lg bg-secondary py-3 text-base font-bold text-white shadow-lg shadow-secondary/30 active:scale-95 transition-transform duration-150 active:bg-opacity-80 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-xl">notifications_active</span>
            Send a Nudge
          </button>
</div>
<div class="flex flex-col rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
<div class="flex items-center gap-3 p-4">
<img alt="Profile picture of a woman smiling" class="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGAV0M00GKoEreIwUWy6sT4SZyOQxeI3o_Pu8jkzj3v0uFzcgtrR8UWwlYzbPBh9JWQTeH8vJXAKOtrOGA6uUmn9EihdOneu80mxcncpQ-ViPmBN_HZVs_BVs-zl8O-O0AUypOgTqucH86PcZKc-zEBsofKDODDp-A14jLDmIwmaIR-g7ltXYIPz6dQRJm485kLnU_v10J9LC_kiIDD7HGDUvZ1tpf_vWkRvH6L9YYa-dI_0Wz9I24ySI5W1UKDzamREbDZB3-MMeI"/>
<div class="flex-1">
<p class="font-bold text-text-light dark:text-text-dark">Jane Doe</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">New Challenge • 2h ago</p>
</div>
</div>
<div class="flex flex-col gap-4 px-4 pb-4">
<div class="flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-white/5 p-4">
<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/10">
<span class="text-4xl">🏋️</span>
</div>
<div class="flex-1">
<p class="font-bold text-lg text-text-light dark:text-white">Leg Day Annihilator</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">45 min workout</p>
</div>
</div>
<div class="w-full">
<div class="mb-1 flex justify-between">
<span class="text-xs font-bold uppercase text-secondary">Mission Progress</span>
<span class="text-xs font-bold text-subtext-light dark:text-subtext-dark">2/3 Friends Joined</span>
</div>
<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
<div class="h-2.5 rounded-full bg-secondary" style="width: 66%"></div>
</div>
</div>
<button class="w-full rounded-lg bg-primary py-3 text-base font-bold text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform duration-150 active:bg-primary-hover">
              Accept Challenge
            </button>
</div>
</div>
<div class="flex flex-col rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
<div class="flex items-center gap-3 p-4">
<img alt="Profile picture of a man with a beard" class="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB58TSuyWFXrmDUr5aetiz_5vU74Cb7bRYyN0QRHnpHrlegpFRmWyo8Tvzt5JJV73383pxGYQUTRY8jrmfdNW5Q2SLN5jKz_TMbzyyjCeNPokjv5ALmq1KTQGJ_o8aHc-4ngZXjmFj2Cbi3jupVOGN0JZgAj0YfkWThei5BhWE4YBL2MAK3UR3TUpuTKyCbZbX6QeK1sssbuwycatU2xk6TQ5m14nLjBtxR5wpTUBZAKlEGRIpNoQ1OxB7IwQ4FcMEuO1OrlszfzC5Y"/>
<div class="flex-1">
<p class="font-bold text-text-light dark:text-text-dark">Alex Ray</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">Recovery Day • 4h ago</p>
</div>
<div class="flex items-center gap-1 rounded-full bg-accent-gold/10 dark:bg-accent-gold/20 px-3 py-1.5">
<span class="material-symbols-outlined text-accent-gold text-xl">health_and_safety</span>
<p class="font-bold text-accent-gold">Zen Mode</p>
</div>
</div>
<div class="flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-white/5 p-4 mx-4 mb-4">
<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-gold/10">
<span class="text-4xl">🧘</span>
</div>
<div class="flex-1">
<p class="font-bold text-lg text-text-light dark:text-white">Active Recovery</p>
<p class="text-sm text-subtext-light dark:text-subtext-dark">Rest is part of the process.</p>
</div>
</div>
</div>
</div>
</div>
</div>

</body></html>