// ===================== ORIGINAL CODE =====================
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    // this part will bloat (lead to long function -> inefficient for readability and maintainability - anti-pattern)
    // if we have too many blockchains in the future, so we should refactor it into a data structure
    // for example, use a constant or an enum map (or a dictionary) which keys are blockchain names
    // and values are their priorities and it will make it easier
    // to maintain and refactor
    switch (blockchain) {
      // hardcode - this is anti-pattern which create code duplication that violates
      // single source of truth principle (DRY - don't repeat yourself)
      // should transform this into a constant data structure or an enum map
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // three below functions/code can be merged into a single function/mapping code
  // for more efficient, reduce code duplication and also improve performance
  // by avoid recomputing the same value multiple times (like rows computation code is
  // executed every render and return a new array every time). It should
  // only be computed once and store the result in a variable for later use
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  // unused code - should be removed and the format transformation can be merge with
  // below mapping code (rows constant)
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    },
  );

  return <div {...rest}>{rows}</div>;
};
// ================= END ORIGINAL CODE ==========================

// ===================== REFACTORED CODE =======================

const blockchainPriorities = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// getPriority helper function - replace the switch case in original code
const getPriority = (blockchain: string): number => {
  return typeof blockchainPriorities[blockchain] === "number"
    ? blockchainPriorities[blockchain]
    : -99;
};

const getFormattedAndSortedBalances = (balances: WalletBalance[]) => {
  const sortedBalances = balances
    .reduce((acc, balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > -99) {
        if (balance.amount <= 0) {
          // filter and get formatted amount
          acc.push({ ...balance, formatted: balance.amount.toFixed() });
        }
      }
      return acc;
    }, [])
    .sort((lhs: FormattedWalletBalance, rhs: FormattedWalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });

  return sortedBalances;
};

const RefactoredWalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const rows = useMemo(() => {
    const formattedAndSortedBalances = getFormattedAndSortedBalances(balances);

    const result = formattedAndSortedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;

        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      },
    );

    return result;
  }, [balances, prices]);

  return <div {...rest}>{rows}</div>;
};
// ================= END REFACTORED CODE =======================
