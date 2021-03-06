import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  DataListAction as _DataListAction,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  Tooltip,
} from '@patternfly/react-core';
import { t } from '@lingui/macro';
import { withI18n } from '@lingui/react';
import {
  ExclamationTriangleIcon,
  PencilAltIcon,
  RocketIcon,
} from '@patternfly/react-icons';

import LaunchButton from '@components/LaunchButton';
import Sparkline from '@components/Sparkline';
import { toTitleCase } from '@util/strings';
import styled from 'styled-components';

const DataListAction = styled(_DataListAction)`
  align-items: center;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 40px);
`;

function TemplateListItem({ i18n, template, isSelected, onSelect, detailUrl }) {
  const labelId = `check-action-${template.id}`;
  const canLaunch = template.summary_fields.user_capabilities.start;

  const missingResourceIcon =
    template.type === 'job_template' &&
    (!template.summary_fields.project ||
      (!template.summary_fields.inventory &&
        !template.ask_inventory_on_launch));

  return (
    <DataListItem aria-labelledby={labelId} id={`${template.id}`}>
      <DataListItemRow>
        <DataListCheck
          id={`select-jobTemplate-${template.id}`}
          checked={isSelected}
          onChange={onSelect}
          aria-labelledby={labelId}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="divider">
              <span>
                <Link to={`${detailUrl}`}>
                  <b>{template.name}</b>
                </Link>
              </span>
              {missingResourceIcon && (
                <span>
                  <Tooltip
                    content={i18n._(
                      t`Resources are missing from this template.`
                    )}
                    position="right"
                  >
                    <ExclamationTriangleIcon css="color: #c9190b; margin-left: 20px;" />
                  </Tooltip>
                </span>
              )}
            </DataListCell>,
            <DataListCell key="type">
              {toTitleCase(template.type)}
            </DataListCell>,
            <DataListCell key="sparkline">
              <Sparkline jobs={template.summary_fields.recent_jobs} />
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-label="actions"
          aria-labelledby={labelId}
          id={labelId}
        >
          {canLaunch && template.type === 'job_template' && (
            <Tooltip content={i18n._(t`Launch Template`)} position="top">
              <LaunchButton resource={template}>
                {({ handleLaunch }) => (
                  <Button
                    css="grid-column: 1"
                    variant="plain"
                    onClick={handleLaunch}
                  >
                    <RocketIcon />
                  </Button>
                )}
              </LaunchButton>
            </Tooltip>
          )}
          {template.summary_fields.user_capabilities.edit && (
            <Tooltip content={i18n._(t`Edit Template`)} position="top">
              <Button
                css="grid-column: 2"
                variant="plain"
                component={Link}
                to={`/templates/${template.type}/${template.id}/edit`}
              >
                <PencilAltIcon />
              </Button>
            </Tooltip>
          )}
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
}

export { TemplateListItem as _TemplateListItem };
export default withI18n()(TemplateListItem);
