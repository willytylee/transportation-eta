export const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
    {value === index && <div>{children}</div>}
  </div>
);
