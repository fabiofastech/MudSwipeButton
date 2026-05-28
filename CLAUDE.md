# CLAUDE.md

Istruzioni per GitHub Copilot CLI in questo repository.

## Progetto

- **Nome**: MudSwipeButton
- **Tipo**: Blazor Web App (.NET 10) con progetto client WebAssembly + Razor Class Library riutilizzabile
- **Scopo**: Componente `SwipeConfirmButton` — swipe-to-confirm stile iPhone per rispondere/rifiutare chiamate

## Struttura

```
MudSwipeButton/
├── MudSwipeButton.Components/   # ★ Razor Class Library riutilizzabile
│   ├── SwipeConfirmButton.razor      # Componente principale
│   ├── SwipeConfirmButton.razor.css  # Stili isolati
│   └── wwwroot/js/swipebutton.js     # Modulo JS per drag nativo
│
├── MudSwipeButton/              # Server (ASP.NET Core host — app demo)
│   ├── Components/
│   │   ├── Pages/Home.razor     # Pagina demo con 3 esempi
│   │   └── Layout/MainLayout.razor
│   └── Program.cs
│
└── MudSwipeButton.Client/       # Client (Blazor WebAssembly)
    └── Program.cs
```

## Dipendenze

- **MudBlazor 9.5.0** (tutti e 3 i progetti)
- Tutti i progetti referenziano `MudSwipeButton.Components`

## Utilizzo del componente

```razor
<SwipeConfirmButton
    Label="Scorri per rispondere"
    ConfirmedLabel="In chiamata…"
    Icon="@Icons.Material.Filled.Phone"
    TrackColor="#2E7D32"
    OnConfirmed="OnAnswered"
    ResetAfterConfirm="true"
    Width="300px" />
```

### Parametri

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `Label` | string | "Scorri per rispondere" | Testo sul track |
| `ConfirmedLabel` | string | "In chiamata…" | Testo dopo conferma |
| `Icon` | string | Phone | Icona MudBlazor sul thumb |
| `TrackColor` | string | "#2E7D32" | Colore CSS del track |
| `ThresholdPercent` | int | 75 | % da raggiungere per confermare |
| `OnConfirmed` | EventCallback | — | Callback allo swipe completato |
| `Width` | string | "300px" | Larghezza (qualsiasi valore CSS) |
| `Disabled` | bool | false | Disabilita interazione |
| `ResetAfterConfirm` | bool | false | Reset automatico dopo conferma |

### Metodo pubblico

```csharp
await swipeButton.ResetAsync(); // Reset programmatico a stato idle
```

## Ambiente

- **OS**: Windows 11 Pro
- **Shell**: PowerShell 7+ (pwsh)

## Comandi principali

```powershell
# Build
dotnet build MudSwipeButton.slnx

# Run (app demo)
dotnet run --project MudSwipeButton\MudSwipeButton\MudSwipeButton.csproj
```

## Convenzioni

- Usare **CLAUDE.md** (non copilot-instructions.md) come file di istruzioni
- Target framework: `net10.0`
- MudBlazor reference: `C:\Users\f.delorenzi\OneDrive - AFV ACCIAIERIE BELTRAME S.p.A\.copilot\knowledge\mudblazor\mudblazor-9-reference.md`

## Come usare in un'altra soluzione

1. Copia la cartella `MudSwipeButton.Components/` nel progetto target
2. `dotnet add <progetto>.csproj reference MudSwipeButton.Components\MudSwipeButton.Components.csproj`
3. Aggiungi `@using MudSwipeButton.Components` agli `_Imports.razor`
4. Assicurati che MudBlazor sia configurato (servizi + CSS + JS in App.razor)
